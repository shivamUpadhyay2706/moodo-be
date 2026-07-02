const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const {
    addPlan,
    listPlans,
    updatePlan,
    deletePlan
} = require('../controllers/plans');

/**
 * A Plan payload model
 * @typedef {object} PlanPayload
 * @property {string} title.required - Title of the plan (e.g. Flight to Paris, Dinner reservation)
 * @property {string} description - Plan description details
 * @property {string} location - Meeting spot or location address
 * @property {string} startTime - Start time string (ISO format)
 * @property {string} endTime - End time string (ISO format)
 * @property {string} category - Category (travel, lodging, activity, food, function_event, other)
 */

/**
 * POST /api/groups/{groupId}/plans
 * @summary Log a new schedule/itinerary item in a group
 * @tags plans
 * @security BearerAuth
 * @param {string} groupId.path.required - The ID of the group
 * @param {PlanPayload} request.body.required - Plan data - application/json
 * @return {object} 201 - Plan item logged response
 * @return {object} 403 - Forbidden if user is not in group
 */
router.post('/', auth, addPlan);

/**
 * GET /api/groups/{groupId}/plans
 * @summary List group schedule/itinerary events
 * @tags plans
 * @security BearerAuth
 * @param {string} groupId.path.required - The ID of the group
 * @param {string} category.query - Filter by category (optional)
 * @return {array<object>} 200 - List of group plans
 * @return {object} 403 - Forbidden if user is not in group
 */
router.get('/', auth, listPlans);

/**
 * PUT /api/groups/{groupId}/plans/{planId}
 * @summary Update a plan/itinerary details
 * @tags plans
 * @security BearerAuth
 * @param {string} groupId.path.required - The ID of the group
 * @param {string} planId.path.required - The ID of the plan to update
 * @param {PlanPayload} request.body.required - Update fields - application/json
 * @return {object} 200 - Updated plan payload
 * @return {object} 403 - Forbidden if user is not in group
 * @return {object} 404 - Plan not found
 */
router.put('/:planId', auth, updatePlan);

/**
 * DELETE /api/groups/{groupId}/plans/{planId}
 * @summary Delete a plan/itinerary details
 * @tags plans
 * @security BearerAuth
 * @param {string} groupId.path.required - The ID of the group
 * @param {string} planId.path.required - The ID of the plan to delete
 * @return {object} 200 - Success delete message
 * @return {object} 403 - Forbidden if user is not in group
 * @return {object} 404 - Plan not found
 */
router.delete('/:planId', auth, deletePlan);

module.exports = router;
