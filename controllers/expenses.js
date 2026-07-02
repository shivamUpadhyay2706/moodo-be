const expenseService = require('../services/expenseService');

// 1. ADD EXPENSE
const addExpense = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const currentUserId = req.user.userId;
        const expense = await expenseService.addExpense(groupId, req.body, currentUserId);
        res.status(201).json(expense);
    } catch (error) {
        next(error);
    }
};

// 2. LIST ALL EXPENSES IN A GROUP
const listExpenses = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.userId;
        const expenses = await expenseService.listExpenses(groupId, userId);
        res.status(200).json(expenses);
    } catch (error) {
        next(error);
    }
};

// 3. DELETE EXPENSE
const deleteExpense = async (req, res, next) => {
    try {
        const { groupId, expenseId } = req.params;
        const userId = req.user.userId;
        const result = await expenseService.deleteExpense(groupId, expenseId, userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 4. CALCULATE GROUP BALANCES AND DEBTS SPLIT
const getBalanceStats = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.userId;
        const stats = await expenseService.getBalanceStats(groupId, userId);
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

// 5. ADD PERSONAL EXPENSE
const addPersonalExpense = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const expense = await expenseService.addPersonalExpense(req.body, userId);
        res.status(201).json(expense);
    } catch (error) {
        next(error);
    }
};

// 6. LIST PERSONAL EXPENSES
const listPersonalExpenses = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const expenses = await expenseService.listPersonalExpenses(userId);
        res.status(200).json(expenses);
    } catch (error) {
        next(error);
    }
};

// 7. DELETE PERSONAL EXPENSE
const deletePersonalExpense = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const userId = req.user.userId;
        const result = await expenseService.deletePersonalExpense(expenseId, userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addExpense,
    listExpenses,
    deleteExpense,
    getBalanceStats,
    addPersonalExpense,
    listPersonalExpenses,
    deletePersonalExpense
};
