const userController = require("./controllers/userController");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await userController.getUserByEmail(email);
        if (user === null) {
            return done(null, false, { message: "No user found with that email" });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "The email or password is incorrect" });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userController.getUserById(id);
        // console.log(user);
        return done(null, user);
    });
}

module.exports = initialize;
