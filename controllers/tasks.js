const taskService = require('../services/taskService');

// 1. ADD TASK
const addTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const task = await taskService.createTask(userId, req.body);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// 2. GET TASKS WITH SMART FILTERING
const getTasks = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const tasks = await taskService.getTasks(userId, req.query);
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// 3. UPDATE TASK
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const updatedTask = await taskService.updateTask(id, userId, req.body);
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

// 4. DELETE TASK
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const result = await taskService.deleteTask(id, userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 5. GET TASKS STATS & PROGRESS TRACKER
const getTaskStats = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { groupId } = req.query;
        const stats = await taskService.getTaskStats(userId, groupId);
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskStats
};
