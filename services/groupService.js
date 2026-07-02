const Group = require('../models/group');
const User = require('../models/user');

const createGroup = async (name, description, userId) => {
    if (!name) {
        const err = new Error("Group name is required! ❌");
        err.statusCode = 400;
        throw err;
    }

    const newGroup = new Group({
        name,
        description,
        members: [userId],
        createdBy: userId
    });

    return await newGroup.save();
};

const listGroups = async (userId) => {
    return await Group.find({ members: userId }).populate('createdBy', 'username');
};

const inviteMember = async (groupId, username, currentUserId) => {
    if (!username) {
        const err = new Error("Username is required to invite! ❌");
        err.statusCode = 400;
        throw err;
    }

    const group = await Group.findById(groupId);
    if (!group) {
        const err = new Error("Group not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify current user is a member of the group
    if (!group.members.includes(currentUserId)) {
        const err = new Error("Access denied. You are not a member of this group! 🔒");
        err.statusCode = 403;
        throw err;
    }

    // Find user to invite
    const invitee = await User.findOne({ username });
    if (!invitee) {
        const err = new Error("User to invite not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Check if already in group
    if (group.members.includes(invitee._id)) {
        const err = new Error("User is already a member of this group! ❌");
        err.statusCode = 400;
        throw err;
    }

    group.members.push(invitee._id);
    await group.save();

    return { message: `Successfully added ${username} to group! 🎉`, group };
};

const getGroupMembers = async (groupId, currentUserId) => {
    const group = await Group.findById(groupId).populate('members', 'username createdAt');
    if (!group) {
        const err = new Error("Group not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify current user is member
    const isMember = group.members.some(member => member._id.toString() === currentUserId);
    if (!isMember) {
        const err = new Error("Access denied. You are not a member of this group! 🔒");
        err.statusCode = 403;
        throw err;
    }

    return group.members;
};

module.exports = {
    createGroup,
    listGroups,
    inviteMember,
    getGroupMembers
};
