const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const auth = (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if not token
    if (!authHeader) {
        return res.status(401).json({ message: "No token, authorization denied! 🔒" });
    }

    try {
        // Expected format: "Bearer <token>"
        let token = authHeader;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Add user ID to request object
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid! ❌" });
    }
};

module.exports = auth;
