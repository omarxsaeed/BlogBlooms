const express = require("express");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const middlewares = require("../middlewares/authenticate");
const Blog = require("../models/blog");
const blogController = require("./../controllers/blogController");
const path = require("path");
const router = express.Router();

router.get("/new", middlewares.checkAuthenticated, (req, res) => {
    res.render("blogs/new", { blog: new Blog() });
});

router.post("/", middlewares.checkAuthenticated, async (req, res) => {
    let blogData = {
        title: req.body.title,
        body: req.body.body,
        photo: req.files,
        author: { id: req.user.id, name: req.user.name },
        tags: req.body.tags,
    };
    console.log(req);
    res.send("done");

    // try {
    //     let blog = await blogController.addBlog(blogData);
    //     res.redirect(`blogs/${blog.slug}`);
    // } catch (error) {
    //     console.log(error);
    //     res.render("blogs/new", { blog: blogData });
    // }
});

router.get("/:slug", async (req, res) => {
    let blog = await blogController.searchBlogs("slug", req.params.slug);
    if (blog === null) res.redirect("/");
    res.render("blogs/display", { blog: blog });
});

module.exports = router;
