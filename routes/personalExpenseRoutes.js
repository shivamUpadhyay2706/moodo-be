const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    addPersonalExpense,
    listPersonalExpenses,
    deletePersonalExpense
} = require('../controllers/expenses');

/**
 * POST /api/expenses
 * @summary Log a new personal expense
 * @tags expenses
 * @security BearerAuth
 * @param {object} request.body.required - Expense data - application/json
 * @return {object} 201 - Expense logged response
 */
router.post('/', auth, addPersonalExpense);

/**
 * GET /api/expenses
 * @summary Retrieve a list of all personal expenses
 * @tags expenses
 * @security BearerAuth
 * @return {array<object>} 200 - List of expenses
 */
router.get('/', auth, listPersonalExpenses);

/**
 * DELETE /api/expenses/{expenseId}
 * @summary Delete a personal expense entry
 * @tags expenses
 * @security BearerAuth
 * @param {string} expenseId.path.required - The ID of the expense to delete
 * @return {object} 200 - Success delete response
 */
router.delete('/:expenseId', auth, deletePersonalExpense);

module.exports = router;
