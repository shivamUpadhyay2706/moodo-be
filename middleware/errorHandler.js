// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error("API Error ❌:", err.stack || err.message);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: "Validation Error! ❌",
            errors: Object.values(err.errors).map(el => el.message)
        });
    }

    // Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(400).json({
            message: `Duplicate field value entered: ${field}. Please use another value! ❌`
        });
    }

    // Mongoose CastError (e.g. invalid ObjectId format)
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: `Invalid format for field ${err.path}: ${err.value} ❌`
        });
    }

    // Custom status code if provided, default to 500 Internal Server Error
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "An unexpected server error occurred! ❌";

    res.status(statusCode).json({
        message,
        // Include stack trace only in development environment
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
