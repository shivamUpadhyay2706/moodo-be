const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const taskRoutes = require('./routes/taskRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const planRoutes = require('./routes/planRoutes');
const personalExpenseRoutes = require('./routes/personalExpenseRoutes');
const errorHandler = require('./middleware/errorHandler');

const expressJSDocSwagger = require('express-jsdoc-swagger');

const app = express();
const { PORT } = require('./config/env');

// Application Middleware Settings
app.use(cors());
app.use(express.json());

// Database connection middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ 
            message: "Database connection failed ❌", 
            error: err.message 
        });
    }
});

// Swagger documentation configuration
expressJSDocSwagger(app)({
    info: {
        title: 'Smart Group To-Do & Planner API Documentation',
        version: '1.0.0',
        description: 'A comprehensive authenticated API for managing personal/group tasks, expenses, and itinerary planners.',
    },
    baseDir: __dirname,
    filesPattern: './routes/*.js',
    swaggerUIPath: '/api-docs',
    security: {
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groups/:groupId/expenses', expenseRoutes);
app.use('/api/groups/:groupId/plans', planRoutes);
app.use('/api/expenses', personalExpenseRoutes);

// Base route
app.get('/', (req, res) => {
    res.send("Your Smart To-Do & Planner API Server is Alive! View Swagger docs at http://localhost:3001/api-docs 🚀");
});

// Register Global Error Handler Middleware
app.use(errorHandler);

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server started on: http://localhost:${PORT}`);
        console.log(`Swagger Documentation available at: http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;