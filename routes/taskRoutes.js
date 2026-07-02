const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskStats
} = require('../controllers/tasks');

/**
 * A Subtask model
 * @typedef {object} Subtask
 * @property {string} title.required - The checklist item title
 * @property {boolean} isCompleted - The completion status of the subtask
 */

/**
 * A Task payload model
 * @typedef {object} TaskPayload
 * @property {string} title.required - Task title
 * @property {string} description - Task description
 * @property {string} status - Task status (pending, in_progress, completed)
 * @property {string} priority - Task priority (low, medium, high)
 * @property {string} dueDate - Due date string (ISO date format)
 * @property {array<string>} tags - Categories or tag tags
 * @property {array<Subtask>} subtasks - Subtask checklist items
 * @property {string} recurrence - Task recurrence frequency (none, daily, weekly, monthly)
 * @property {string} dueReminderTime - Time to send notifications
 * @property {string} groupId - The associated Group ID (optional, for group tasks)
 * @property {array<string>} assignees - User IDs assigned to this task (optional, group members only)
 */

/**
 * POST /api/tasks
 * @summary Create a new task (personal or group-bound)
 * @tags tasks
 * @security BearerAuth
 * @param {TaskPayload} request.body.required - Task details - application/json
 * @return {object} 201 - Task created response
 * @return {object} 401 - Unauthorized
 * @return {object} 403 - Forbidden if user is not in group
 */
router.post('/', auth, addTask);

/**
 * GET /api/tasks
 * @summary List tasks (either personal tasks, or group tasks if groupId query param is provided)
 * @tags tasks
 * @security BearerAuth
 * @param {string} groupId.query - The group ID to retrieve tasks for (optional)
 * @param {string} status.query - Filter tasks by status (optional)
 * @param {string} priority.query - Filter tasks by priority (optional)
 * @param {string} tag.query - Filter tasks by tag (optional)
 * @param {string} search.query - Text search in title and description (optional)
 * @param {string} sortBy.query - Field to sort by (e.g. dueDate, createdAt) (optional)
 * @param {string} sortOrder.query - Order of sort (asc, desc) (optional)
 * @return {array<object>} 200 - List of tasks
 * @return {object} 401 - Unauthorized
 */
router.get('/', auth, getTasks);

/**
 * GET /api/tasks/stats
 * @summary Retrieve tasks statistics and completion metrics
 * @tags tasks
 * @security BearerAuth
 * @param {string} groupId.query - Group ID to compute stats for (optional)
 * @return {object} 200 - Dynamic metrics including completionRate and overdueTasks
 * @return {object} 401 - Unauthorized
 */
router.get('/stats', auth, getTaskStats);

/**
 * PUT /api/tasks/{id}
 * @summary Update task details, checklist, status, or assignees
 * @tags tasks
 * @security BearerAuth
 * @param {string} id.path.required - The unique task ID
 * @param {TaskPayload} request.body.required - Update fields - application/json
 * @return {object} 200 - Updated task payload
 * @return {object} 403 - Forbidden if user has no edit permissions
 * @return {object} 404 - Task not found
 */
router.put('/:id', auth, updateTask);

/**
 * DELETE /api/tasks/{id}
 * @summary Delete a task
 * @tags tasks
 * @security BearerAuth
 * @param {string} id.path.required - The unique task ID
 * @return {object} 200 - Successful delete message
 * @return {object} 403 - Forbidden if user does not own task
 * @return {object} 404 - Task not found
 */
router.delete('/:id', auth, deleteTask);

module.exports = router;
