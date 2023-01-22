if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const path = require("path");
const express = require("express");
const passport = require("passport");
const multer = require("multer");
const mongoose = require("mongoose");
const flash = require("express-flash");
const session = require("express-session");
const loginRoute = require("./routes/loginRoute");
const blogsRoute = require("./routes/blogsRoute");
const initializePassport = require("./passport-config");
const registerRoute = require("./routes/registerRoute");
const blogController = require("./controllers/blogController");
const middlewares = require("./middlewares/authenticate");
const methodOverride = require("method-override");
const app = express();
const port = 3000;

initializePassport(passport);

app.use(flash());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use("/assets", express.static("assets"));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/blogs", blogsRoute);

app.set("view engine", "ejs");
mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/BlogBlooms");

// Homepage
app.get("/", async (req, res) => {
    if (req.user) {
        user = req.user;
    } else {
        user = "";
    }
    let blogs = await blogController.searchBlogs("all", req.params.id);
    res.render("blogs/index", { blogs: blogs, user: user });
});

app.delete("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
