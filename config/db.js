const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
    try {
        // Connects using database config
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Database Connected! 🎉");
    } catch (error) {
        console.error("Database failed ❌:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;