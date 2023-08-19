import express from "express"
import ejs from "ejs"
import bodyParser from "body-parser"
import _ from "lodash"
import mongoose, { mongo } from "mongoose"

const app = express();
const port = 3000;

mongoose.connect("mongodb+srv://admin-aditya:test123@blogcluster.w5pe6rb.mongodb.net/blogDB",  {useNewUrlParser: true});
// mongoose.connect("mongodb://127.0.0.1:27017/blogDB",  {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("post", postSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    posts:[postSchema]
});
const User = mongoose.model("user", userSchema);


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:true }));

app.get("/login", (req, res)=>{
    res.render("login.ejs");
})

app.get("/", (req, res) => {

    Post.find()
    .then((posts)=>{
        res.render("home.ejs", {
            data:posts.reverse(),
        });
        console.log("Success");
    }).catch( (err) =>{
        console.log(err);
    });
})


app.get("/write", (req, res) => {
    res.render("write.ejs");
})

app.post("/write", (req, res) => {
    
    let post_heading = req.body["blog-title"];
    let post_body = req.body["blog-post"];

    const post = new Post({
        title: post_heading,
        content: post_body
    });
    post.save()
    .then(()=>{
        console.log("Data added");
        res.redirect("/");
    }).catch((err)=>{
        console.log(err);
    });
})

app.get("/posts/:postId", (req, res)=>{

    Post.findOne({_id: req.params.postId})
    .then((foundItem)=>{
        console.log("Found item");

        res.render("post.ejs", {
            data : foundItem,
        });

    }).catch((err)=>{
        console.log(err);
    });
});

app.post("/delete", (req, res)=>{
    
    const itemId = req.body.delete;
    
    Post.findByIdAndRemove(itemId)
    .then(()=>{
        console.log("Deleted");
        res.redirect("/")
    })
    .catch((err)=>{
        console.log(err);
    })
});



app.get("/about", (req, res)=>{
    res.render("about.ejs");
})

app.listen(port, () => {
    console.log(`Server is up & running!, at ${port}`);
});
