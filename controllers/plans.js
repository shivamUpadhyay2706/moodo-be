const planService = require('../services/planService');

// 1. ADD PLAN
const addPlan = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.userId;
        const plan = await planService.addPlan(groupId, req.body, userId);
        res.status(201).json(plan);
    } catch (error) {
        next(error);
    }
};

// 2. LIST GROUP PLANS
const listPlans = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { category } = req.query;
        const userId = req.user.userId;
        const plans = await planService.listPlans(groupId, category, userId);
        res.status(200).json(plans);
    } catch (error) {
        next(error);
    }
};

// 3. UPDATE PLAN
const updatePlan = async (req, res, next) => {
    try {
        const { groupId, planId } = req.params;
        const userId = req.user.userId;
        const updatedPlan = await planService.updatePlan(groupId, planId, req.body, userId);
        res.status(200).json(updatedPlan);
    } catch (error) {
        next(error);
    }
};

// 4. DELETE PLAN
const deletePlan = async (req, res, next) => {
    try {
        const { groupId, planId } = req.params;
        const userId = req.user.userId;
        const result = await planService.deletePlan(groupId, planId, userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addPlan,
    listPlans,
    updatePlan,
    deletePlan
};
