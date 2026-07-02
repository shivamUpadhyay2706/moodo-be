const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createGroup,
    listGroups,
    inviteMember,
    getGroupMembers
} = require('../controllers/groups');

/**
 * A Group payload model
 * @typedef {object} GroupPayload
 * @property {string} name.required - The name of the group
 * @property {string} description - The description of the group
 */

/**
 * An Invite payload model
 * @typedef {object} InvitePayload
 * @property {string} username.required - The username of the user to invite
 */

/**
 * POST /api/groups
 * @summary Create a new collaboration group (e.g. trip, event)
 * @tags groups
 * @security BearerAuth
 * @param {GroupPayload} request.body.required - Group details - application/json
 * @return {object} 201 - Group created response
 * @return {object} 401 - Unauthorized
 */
router.post('/', auth, createGroup);

/**
 * GET /api/groups
 * @summary List all groups the logged-in user belongs to
 * @tags groups
 * @security BearerAuth
 * @return {array<object>} 200 - List of groups
 * @return {object} 401 - Unauthorized
 */
router.get('/', auth, listGroups);

/**
 * POST /api/groups/{groupId}/invite
 * @summary Invite another registered user to the group
 * @tags groups
 * @security BearerAuth
 * @param {string} groupId.path.required - The group ID
 * @param {InvitePayload} request.body.required - Username to invite - application/json
 * @return {object} 200 - Successful invitation message
 * @return {object} 400 - Validation error or already in group
 * @return {object} 403 - Forbidden if user is not in the group
 * @return {object} 404 - Group or Invitee not found
 */
router.post('/:groupId/invite', auth, inviteMember);

/**
 * GET /api/groups/{groupId}/members
 * @summary Get list of group members
 * @tags groups
 * @security BearerAuth
 * @param {string} groupId.path.required - The group ID
 * @return {array<object>} 200 - List of users in the group
 * @return {object} 403 - Forbidden if user is not in the group
 * @return {object} 404 - Group not found
 */
router.get('/:groupId/members', auth, getGroupMembers);

module.exports = router;
