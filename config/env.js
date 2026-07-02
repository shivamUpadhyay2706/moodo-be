require('dotenv').config();

// Centralized environment variables config with sensible local development defaults
module.exports = {
    PORT: process.env.PORT || 3001,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notesDB',
    JWT_SECRET: process.env.JWT_SECRET || 'my_super_secret_keycard_string_123'
};
