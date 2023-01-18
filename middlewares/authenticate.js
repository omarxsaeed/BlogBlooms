const passport = require("passport");

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log("Not authenticated");
        return res.redirect("/login");
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
