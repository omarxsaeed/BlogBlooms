const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const middlewares = require("../middlewares/authenticate");
const router = express.Router();

router.get("/", middlewares.checkNotAuthenticated, (req, res) => {
    res.render("user/login");
});

router.post(
    "/",
    middlewares.checkNotAuthenticated,
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        session: true,
    })
);

module.exports = router;
