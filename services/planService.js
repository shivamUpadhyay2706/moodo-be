const Plan = require('../models/plan');
const Group = require('../models/group');

const addPlan = async (groupId, planData, userId) => {
    const { title, description, location, startTime, endTime, category } = planData;

    if (!title) {
        const err = new Error("Plan title is required! ❌");
        err.statusCode = 400;
        throw err;
    }

    const group = await Group.findById(groupId);
    if (!group) {
        const err = new Error("Group not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify membership
    if (!group.members.includes(userId)) {
        const err = new Error("Forbidden: You are not a member of this group! 🔒");
        err.statusCode = 403;
        throw err;
    }

    const newPlan = new Plan({
        group: groupId,
        title,
        description,
        location,
        startTime,
        endTime,
        category: category || 'other'
    });

    return await newPlan.save();
};

const listPlans = async (groupId, category, userId) => {
    const group = await Group.findById(groupId);
    if (!group) {
        const err = new Error("Group not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify membership
    if (!group.members.includes(userId)) {
        const err = new Error("Forbidden: You are not a member of this group! 🔒");
        err.statusCode = 403;
        throw err;
    }

    let query = { group: groupId };
    if (category) {
        query.category = category;
    }

    return await Plan.find(query).sort({ startTime: 1 });
};

const updatePlan = async (groupId, planId, updates, userId) => {
    const group = await Group.findById(groupId);
    if (!group) {
        const err = new Error("Group not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify membership
    if (!group.members.includes(userId)) {
        const err = new Error("Forbidden: You are not a member of this group! 🔒");
        err.statusCode = 403;
        throw err;
    }

    const plan = await Plan.findOne({ _id: planId, group: groupId });
    if (!plan) {
        const err = new Error("Plan not found under this group! ❌");
        err.statusCode = 404;
        throw err;
    }

    Object.keys(updates).forEach(key => {
        plan[key] = updates[key];
    });

    return await plan.save();
};

const deletePlan = async (groupId, planId, userId) => {
    const group = await Group.findById(groupId);
    if (!group) {
        const err = new Error("Group not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify membership
    if (!group.members.includes(userId)) {
        const err = new Error("Forbidden: You are not a member of this group! 🔒");
        err.statusCode = 403;
        throw err;
    }

    const plan = await Plan.findOneAndDelete({ _id: planId, group: groupId });
    if (!plan) {
        const err = new Error("Plan not found under this group! ❌");
        err.statusCode = 404;
        throw err;
    }

    return { message: "Plan deleted successfully! 🗑" };
};

module.exports = {
    addPlan,
    listPlans,
    updatePlan,
    deletePlan
};
