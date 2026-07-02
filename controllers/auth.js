const authService = require('../services/authService');

// 1. REGISTER CONTROLLER LOGIC
const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.registerUser(username, password);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// 2. LOGIN CONTROLLER LOGIC
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.loginUser(username, password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };