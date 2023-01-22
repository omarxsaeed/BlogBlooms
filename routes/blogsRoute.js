const express = require("express");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const middlewares = require("../middlewares/authenticate");
const Blog = require("../models/blog");
const blogController = require("./../controllers/blogController");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "assets/images");
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.get("/new", middlewares.checkAuthenticated, (req, res) => {
    res.render("blogs/new", { blog: new Blog() });
});

router.get("/edit/:id", middlewares.checkAuthenticated, async (req, res) => {
    let blog = await blogController.searchBlogs("id", req.params.id);
    res.render("blogs/edit", { blog: blog });
});

router.post(
    "/",
    middlewares.checkAuthenticated,
    upload.single("image"),
    async (req, res, next) => {
        req.blog = new Blog();
        next();
    },
    saveBlogAndRedirect("new")
);

router.get("/:slug", async (req, res) => {
    if (req.user) {
        user = req.user;
    } else {
        user = "";
    }

    let blog = await blogController.searchBlogs("slug", req.params.slug);
    if (blog === null) res.redirect("/");
    res.render("blogs/display", { blog: blog, user: user });
});

router.put(
    "/:id",
    async (req, res, next) => {
        req.blog = await blogController.searchBlogs("id", req.params.id);
        next();
    },
    saveBlogAndRedirect("edit")
);

router.delete("/:slug", async (req, res) => {
    await blogController.deleteBlog(req.params.slug);
    res.redirect("/");
});

function saveBlogAndRedirect(path) {
    return async (req, res) => {
        console.log(req);
        let blog = req.blog;
        blog.title = req.body.title;
        blog.body = req.body.body;
        if (req.file) {
            blog.image = req.file.path;
        }
        blog.author = { id: req.user.id, name: req.user.name };
        blog.tags = req.body.tags;

        try {
            saveRes = await blogController.saveBLog(blog);
            res.redirect(`blogs/${blog.slug}`);
        } catch (error) {
            console.log(error);
            res.render(`blogs/${path}`, { blog: blog });
        }
    };
}
module.exports = router;
