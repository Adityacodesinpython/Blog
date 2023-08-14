import express from "express"
import ejs from "ejs"
import bodyParser from "body-parser"
import _ from "lodash"

const app = express();
const port = 3000;

// let headings = [];
// let bodys = [];

let data = []
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:true }));

app.get("/", (req, res) => {
    res.render("home.ejs", {
        // post_heading: headings,
        // post_body: bodys,
        data:data,
    });
})


app.get("/write", (req, res) => {
    res.render("write.ejs");
})

app.post("/write", (req, res) => {
    
    let post_heading = req.body["blog-title"];
    let post_body = req.body["blog-post"];
    data.push({
        heading: post_heading,
        body: post_body
    })
    data = data.reverse();
    // headings.push(post_heading);
    // bodys.push(post_body);

    res.redirect("/");

})

app.get("/posts/:postName", (req, res)=>{
    data.forEach(i => {
        if(_.lowerCase(i.heading) == _.lowerCase(req.params.postName)){
            // console.log("Match found");
            res.render("post.ejs", {
                data : {
                    heading: i.heading,
                    body: i.body,
                },
            })
        }
    })
});

app.get("/about", (req, res)=>{
    res.render("about.ejs");
})

app.listen(port, () => {
    console.log(`Server is up & running!, at ${port}`);
});