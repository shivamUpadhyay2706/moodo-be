const Task = require('../models/task');
const Group = require('../models/group');

const createTask = async (userId, taskData) => {
    const {
        title, description, status, priority, dueDate,
        tags, subtasks, recurrence, dueReminderTime, groupId, assignees
    } = taskData;

    if (!title) {
        const err = new Error("Task title is required! ❌");
        err.statusCode = 400;
        throw err;
    }

    let taskGroup = null;
    let taskAssignees = [];

    if (groupId) {
        const group = await Group.findById(groupId);
        if (!group) {
            const err = new Error("Group not found! ❌");
            err.statusCode = 404;
            throw err;
        }
        if (!group.members.includes(userId)) {
            const err = new Error("Forbidden: You are not a member of this group! 🔒");
            err.statusCode = 403;
            throw err;
        }
        taskGroup = groupId;

        if (assignees && Array.isArray(assignees)) {
            for (const memberId of assignees) {
                if (!group.members.includes(memberId)) {
                    const err = new Error(`Assignee ${memberId} is not a member of this group! ❌`);
                    err.statusCode = 400;
                    throw err;
                }
            }
            taskAssignees = assignees;
        }
    }

    const newTask = new Task({
        user: userId,
        group: taskGroup,
        assignees: taskAssignees,
        title,
        description,
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate,
        tags: tags || [],
        subtasks: subtasks || [],
        recurrence: recurrence || 'none',
        dueReminderTime,
        reminderSent: false
    });

    return await newTask.save();
};

const getTasks = async (userId, queryOptions) => {
    const { groupId, status, priority, tag, search, sortBy, sortOrder } = queryOptions;

    let query = {};

    if (groupId) {
        const group = await Group.findById(groupId);
        if (!group) {
            const err = new Error("Group not found! ❌");
            err.statusCode = 404;
            throw err;
        }
        if (!group.members.includes(userId)) {
            const err = new Error("Forbidden: You are not a member of this group! 🔒");
            err.statusCode = 403;
            throw err;
        }
        query.group = groupId;
    } else {
        query.group = null;
        query.user = userId;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tag) query.tags = tag;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    let sortObj = {};
    if (sortBy) {
        const order = sortOrder === 'desc' ? -1 : 1;
        sortObj[sortBy] = order;
    } else {
        sortObj.createdAt = -1;
    }

    return await Task.find(query)
        .populate('user', 'username')
        .populate('assignees', 'username')
        .sort(sortObj);
};

const updateTask = async (taskId, userId, updates) => {
    const task = await Task.findById(taskId);
    if (!task) {
        const err = new Error("Task not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify permissions
    if (task.group) {
        const group = await Group.findById(task.group);
        if (!group || !group.members.includes(userId)) {
            const err = new Error("Forbidden: You are not a member of the group this task belongs to! 🔒");
            err.statusCode = 403;
            throw err;
        }
    } else {
        if (task.user.toString() !== userId) {
            const err = new Error("Forbidden: You do not own this personal task! 🔒");
            err.statusCode = 403;
            throw err;
        }
    }

    // Validate assignees
    if (updates.assignees && task.group) {
        const group = await Group.findById(task.group);
        for (const memberId of updates.assignees) {
            if (!group.members.includes(memberId)) {
                const err = new Error(`Assignee ${memberId} is not a member of the group! ❌`);
                err.statusCode = 400;
                throw err;
            }
        }
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
        task[key] = updates[key];
    });

    return await task.save();
};

const deleteTask = async (taskId, userId) => {
    const task = await Task.findById(taskId);
    if (!task) {
        const err = new Error("Task not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify permissions
    if (task.group) {
        const group = await Group.findById(task.group);
        if (!group || !group.members.includes(userId)) {
            const err = new Error("Forbidden: You are not a member of the group this task belongs to! 🔒");
            err.statusCode = 403;
            throw err;
        }
    } else {
        if (task.user.toString() !== userId) {
            const err = new Error("Forbidden: You do not own this personal task! 🔒");
            err.statusCode = 403;
            throw err;
        }
    }

    await Task.findByIdAndDelete(taskId);
    return { message: "Task deleted successfully! 🗑️" };
};

const getTaskStats = async (userId, groupId) => {
    let query = {};

    if (groupId) {
        const group = await Group.findById(groupId);
        if (!group) {
            const err = new Error("Group not found! ❌");
            err.statusCode = 404;
            throw err;
        }
        if (!group.members.includes(userId)) {
            const err = new Error("Forbidden: You are not a member of this group! 🔒");
            err.statusCode = 403;
            throw err;
        }
        query.group = groupId;
    } else {
        query.group = null;
        query.user = userId;
    }

    const tasks = await Task.find(query);
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;

    const now = new Date();
    const overdue = tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now).length;

    const lowPriority = tasks.filter(t => t.priority === 'low').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;

    const completionRate = total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0;

    return {
        totalTasks: total,
        completedTasks: completed,
        inProgressTasks: inProgress,
        pendingTasks: pending,
        overdueTasks: overdue,
        completionRate,
        byPriority: {
            low: lowPriority,
            medium: mediumPriority,
            high: highPriority
        }
    };
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskStats
};
