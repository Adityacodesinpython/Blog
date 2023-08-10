import express from "express"
import ejs from "ejs"
import bodyParser from "body-parser"

const app = express();
const port = 3000;
let headings = [];
let bodys = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        type: "/",
        post_heading: headings,
        post_body: bodys,
    });
})

app.post("/", (req, res) => {
    res.redirect(req.get('referer'));
})


app.get("/write", (req, res) => {
    res.render("write.ejs", {
        type: "/write",
        post_heading: headings,
        post_body: bodys,
    });

})

app.post("/write", (req, res) => {
    
    let post_heading = req.body["blog-title"];
    let post_body = req.body["blog-post"];
    headings.push(post_heading);
    bodys.push(post_body);

    res.render("write.ejs", {
        post_heading: headings,
        post_body : bodys,
        type : "/write"
    })

})

app.listen(port, () => {
    console.log(`Server is up & running!, at ${port}`);
});