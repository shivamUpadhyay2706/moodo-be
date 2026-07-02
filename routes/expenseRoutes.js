const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const {
    addExpense,
    listExpenses,
    deleteExpense,
    getBalanceStats
} = require('../controllers/expenses');

/**
 * An Expense payload model
 * @typedef {object} ExpensePayload
 * @property {string} description.required - Description of the expense
 * @property {number} amount.required - Total expense cost
 * @property {string} paidBy - Payer's User ID (optional, defaults to current logged-in user)
 * @property {array<string>} splitAmong - Array of User IDs splitting this expense (optional, defaults to all group members)
 * @property {string} date - Custom expense date string (optional)
 */

/**
 * POST /api/groups/{groupId}/expenses
 * @summary Log a new group expense and split costs
 * @tags expenses
 * @security BearerAuth
 * @param {string} groupId.path.required - The ID of the group
 * @param {ExpensePayload} request.body.required - Expense data - application/json
 * @return {object} 201 - Expense logged response
 * @return {object} 403 - Forbidden if user is not in group
 */
router.post('/', auth, addExpense);

/**
 * GET /api/groups/{groupId}/expenses
 * @summary Retrieve a list of all group expenses
 * @tags expenses
 * @security BearerAuth
 * @param {string} groupId.path.required - The ID of the group
 * @return {array<object>} 200 - List of expenses
 * @return {object} 403 - Forbidden if user is not in group
 */
router.get('/', auth, listExpenses);

/**
 * DELETE /api/groups/{groupId}/expenses/{expenseId}
 * @summary Delete an expense entry
 * @tags expenses
 * @security BearerAuth
 * @param {string} groupId.path.required - The ID of the group
 * @param {string} expenseId.path.required - The ID of the expense to delete
 * @return {object} 200 - Success delete message
 * @return {object} 403 - Forbidden if user is not in group
 * @return {object} 404 - Expense not found
 */
router.delete('/:expenseId', auth, deleteExpense);

/**
 * GET /api/groups/{groupId}/expenses/balances
 * @summary Get group balance stats & debt settlements (Splitwise-style transaction solver)
 * @tags expenses
 * @security BearerAuth
 * @param {string} groupId.path.required - The ID of the group
 * @return {object} 200 - Debt balances and exact transaction settle steps
 * @return {object} 403 - Forbidden if user is not in group
 */
router.get('/balances', auth, getBalanceStats);

module.exports = router;
