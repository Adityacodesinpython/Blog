import express from "express"
import ejs from "ejs"
import bodyParser from "body-parser"
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

app.get("/register", (req, res)=>{
    res.render("register.ejs");
})

app.post("/register", (req, res)=>{
    const userName = req.body.username;
    const userPassword = req.body.password;

    User.findOne({username: userName})
    .then((userObject)=>{
        if(userObject){
            // user already exists -> show error
            console.log("u already exist")
            res.render("register.ejs", {
                check:true
            })
        }
        else{
            // create new user

            const userInfo = new User({
                username: userName,
                password: userPassword,
                posts: {
                    title: "Welcome to your blog",
                    content: "Hope u have a good time here :)"
                }
            })
        
            userInfo.save()
            // var urlString = encodeURIComponent(userObject);
            // res.redirect('/?valid=' + urlString);

            User.findOne({username:userName, password: userPassword})
            .then((userInfo)=>{
                var urlString = JSON.stringify(userInfo);
                res.redirect('/?valid=' + urlString);
            });   
        }
    })
})

app.get("/login", (req, res)=>{
    res.render("login.ejs");
})

app.post("/login", (req,res)=>{
    const userName = req.body.username;
    const userPassword = req.body.password;

    User.findOne({username:userName, password: userPassword})
    .then((userObject)=>{
        if(userObject){
            // redirect to home
            
            
            var urlString = JSON.stringify(userObject);
            
            res.redirect('/?valid=' + urlString);
            
        }
        else{
            // pleaase register first or check credentials
            res.render("login.ejs", {
                check: true
            })
        }
    })
})

app.get("/", (req, res) => {
    
    if(req.query.valid){
        var urlUserInfo = req.query.valid;
        // console.log(("getoutput: "+urlUserInfo))

        urlUserInfo = JSON.parse(urlUserInfo);
        
        console.log("output:  "+ JSON.stringify(urlUserInfo))
        User.findOne({username:urlUserInfo.username, password:urlUserInfo.password})
        .then((userInfo)=>{
            // console.log(userInfo)
            res.render("home.ejs", {
                data:userInfo.posts.reverse(),
                userInfo:JSON.stringify(urlUserInfo)
            });
        console.log("user found")
        
            
            
            // console.log("Success");
        }).catch( (err) =>{
            console.log(err);
        });
    }
    else{
        res.redirect("/register")
    }
})



app.get("/write", (req, res) => {
    var urlUserInfo = req.query.valid;
    
    // urlUserInfo = JSON.parse(urlUserInfo);
    

    // console.log(urlUserInfo.username)
    res.render("write.ejs",{
        
        userInfo:urlUserInfo
    });

})

app.post("/write", (req, res) => {
    
    var urlUserInfo = req.query.valid;
    urlUserInfo = JSON.parse(urlUserInfo);

    // console.log("output i need rn:   "+urlUserInfo.username)

    let post_heading = req.body["blog-title"];
    let post_body = req.body["blog-post"];

    const post = new Post({
        title: post_heading,
        content: post_body
    });
    post.save()

    
    User.findOneAndUpdate({username:urlUserInfo.username, password:urlUserInfo.password}, {$push:{posts:post}})
    .then(()=>{

        var urlString = JSON.stringify(urlUserInfo);
        console.log("Data added");
        res.redirect('/?valid=' + urlString);
        
    }).catch((err)=>{
        console.log(err);
    });
})

app.get("/posts/:postId", (req, res)=>{

    var urlUserInfo = req.query.valid;
    urlUserInfo = JSON.parse(urlUserInfo);

    User.findOne({username:urlUserInfo.username, password:urlUserInfo.password})
    .then((foundItem)=>{
        console.log("Found item");
        foundItem.posts.forEach(function(i){
            if (i._id == req.params.postId){    //object ID issue
                res.render("post.ejs", {
                    data : i,
                    userInfo:JSON.stringify(urlUserInfo)
                });
            }
        })
        

    }).catch((err)=>{
        console.log(err);
    });
});

app.post("/delete", (req, res)=>{

    var urlUserInfo = req.query.valid;
    urlUserInfo = JSON.parse(urlUserInfo);

    const itemId = req.body.delete;
    console.log("item to be deleted: "+itemId)
    User.findOneAndUpdate({username:urlUserInfo.username, password:urlUserInfo.password}, {$pull:{posts:{_id:itemId}}})
    .then(()=>{
        console.log("Deleted");
        urlUserInfo = JSON.stringify(urlUserInfo);
        res.redirect('/?valid=' + urlUserInfo);
    })
    .catch((err)=>{
        console.log(err);
    })
});



app.get("/about", (req, res)=>{
    var urlUserInfo = req.query.valid;
    urlUserInfo = JSON.parse(urlUserInfo);

    res.render("about.ejs",{
        userInfo: JSON.stringify(urlUserInfo)
    });
})

app.listen(port, () => {
    console.log(`Server is up & running!, at ${port}`);
});
