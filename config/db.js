const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }
    try {
        console.log("Connecting to MongoDB Atlas...");
        const db = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Fast timeout of 5s instead of 30s
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB Database Connected successfully! 🎉");
    } catch (error) {
        console.error("Database connection failed ❌:", error.message);
        throw error;
    }
};

module.exports = connectDB;