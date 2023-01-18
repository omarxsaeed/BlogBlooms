const User = require("./../models/user");

async function registerUser(userData) {
    let user = await User.create(userData);
    return user;
}

async function getUserById(id) {
    let user = await User.findById(id);
    return user;
}

async function getUserByEmail(email) {
    let user = await User.findOne({ email: email });
    return user;
}

module.exports = { registerUser, getUserByEmail, getUserById };
