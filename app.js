//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


mongoose.connect("mongodb+srv://username:password@cluster0.wgupe.mongodb.net/bloglistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const listSchema = {
    title: String,
    description: String
}

const List = new mongoose.model("List", listSchema);

const list1 = new List({
    title: "Day1",
    description: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});


app.get("/", function(req, res) {
    List.find({}, function(err, foundList) {
        if (!err) {
            if (foundList.length === 0) {
                list1.save();
                console.log("lis not found");
                setTimeout(function() {
                    res.redirect("/");
                }, 300);
            } else {
                console.log("list found");
                res.render("home", { homeStartingContent: homeStartingContent, posts: foundList });
            }
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about", { aboutContent: aboutContent });
})

app.get("/contact", function(req, res) {
    res.render("contact", { contactContent: contactContent });
})

app.get("/compose", function(req, res) {
    res.render("compose");
})

app.post("/compose", function(req, res) {
    let title = req.body.title;
    let description = req.body.description;
    console.log(description);

    List.findOne({ title: title }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                const postData = new List({
                    title: title,
                    description: description
                });
                console.log("list not found");
                postData.save();
                setTimeout(function() {
                    res.redirect("/");
                }, 200);
            } else {
                console.log("listfound");
                //("There is already a post on this title.");
                res.redirect(`/posts/${foundList._id}`);
            }
        }
    });
});

app.get("/posts/:id", function(req, res) {
    urlTitle = req.params.id;
    List.findOne({ _id: urlTitle }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                console.log(foundList, " Not Found");
            } else {
                console.log(foundList, "list found");
                res.render("post", { title: foundList.title, description: foundList.description });
            }
        }
    });
});








app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});