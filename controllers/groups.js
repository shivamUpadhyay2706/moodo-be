const groupService = require('../services/groupService');

// 1. CREATE GROUP
const createGroup = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.userId;
        const group = await groupService.createGroup(name, description, userId);
        res.status(201).json(group);
    } catch (error) {
        next(error);
    }
};

// 2. LIST ALL GROUPS USER IS IN
const listGroups = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const groups = await groupService.listGroups(userId);
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};

// 3. INVITE MEMBER BY USERNAME
const inviteMember = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { username } = req.body;
        const currentUserId = req.user.userId;
        const result = await groupService.inviteMember(groupId, username, currentUserId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 4. GET GROUP MEMBERS
const getGroupMembers = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const currentUserId = req.user.userId;
        const members = await groupService.getGroupMembers(groupId, currentUserId);
        res.status(200).json(members);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGroup,
    listGroups,
    inviteMember,
    getGroupMembers
};
