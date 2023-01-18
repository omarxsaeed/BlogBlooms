const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const userController = require("./../controllers/userController");

router.get("/", (req, res) => {
    res.render("user/register");
});

router.post("/", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let userData = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        };
        let newUser = await userController.registerUser(userData);
        res.redirect("/login");
    } catch (error) {
        res.redirect("/register");
    }
});

module.exports = router;
