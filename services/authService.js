const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const registerUser = async (username, password) => {
    if (!username || !password) {
        const err = new Error("Username and password are required! ❌");
        err.statusCode = 400;
        throw err;
    }

    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
        const err = new Error("Username is already taken! ❌");
        err.statusCode = 400;
        throw err;
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({
        username,
        password: hashedPassword
    });
    await newUser.save();

    return { message: "User registered successfully! 🎉" };
};

const loginUser = async (username, password) => {
    if (!username || !password) {
        const err = new Error("Username and password are required! ❌");
        err.statusCode = 400;
        throw err;
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
        const err = new Error("Invalid username or password! ❌");
        err.statusCode = 400;
        throw err;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const err = new Error("Invalid username or password! ❌");
        err.statusCode = 400;
        throw err;
    }

    // Generate token (expires in 1 hour)
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return {
        message: "Login successful! 🔓",
        token
    };
};

module.exports = {
    registerUser,
    loginUser
};
