const Expense = require('../models/expense');
const Group = require('../models/group');

const addExpense = async (groupId, expenseData, currentUserId) => {
    const { description, amount, paidBy, splitAmong, date } = expenseData;

    if (!description || !amount) {
        const err = new Error("Description and amount are required! ❌");
        err.statusCode = 400;
        throw err;
    }

    const group = await Group.findById(groupId);
    if (!group) {
        const err = new Error("Group not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify current user is member
    if (!group.members.includes(currentUserId)) {
        const err = new Error("Forbidden: You are not a member of this group! 🔒");
        err.statusCode = 403;
        throw err;
    }

    const payerId = paidBy || currentUserId;
    if (!group.members.includes(payerId)) {
        const err = new Error("The payer must be a member of this group! ❌");
        err.statusCode = 400;
        throw err;
    }

    let splitList = splitAmong;
    if (!splitList || !Array.isArray(splitList) || splitList.length === 0) {
        splitList = group.members;
    } else {
        for (const memberId of splitList) {
            if (!group.members.includes(memberId)) {
                const err = new Error(`Split member ${memberId} is not in the group! ❌`);
                err.statusCode = 400;
                throw err;
            }
        }
    }

    const newExpense = new Expense({
        group: groupId,
        description,
        amount: parseFloat(amount),
        paidBy: payerId,
        splitAmong: splitList,
        date: date || Date.now()
    });

    return await newExpense.save();
};

const listExpenses = async (groupId, userId) => {
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

    return await Expense.find({ group: groupId })
        .populate('paidBy', 'username')
        .populate('splitAmong', 'username')
        .sort({ date: -1 });
};

const deleteExpense = async (groupId, expenseId, userId) => {
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

    const expense = await Expense.findById(expenseId);
    if (!expense) {
        const err = new Error("Expense log not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    await Expense.findByIdAndDelete(expenseId);
    return { message: "Expense deleted successfully! 🗑️" };
};

const getBalanceStats = async (groupId, userId) => {
    const group = await Group.findById(groupId).populate('members', 'username');
    if (!group) {
        const err = new Error("Group not found! ❌");
        err.statusCode = 404;
        throw err;
    }

    // Verify membership
    const isMember = group.members.some(member => member._id.toString() === userId);
    if (!isMember) {
        const err = new Error("Forbidden: You are not a member of this group! 🔒");
        err.statusCode = 403;
        throw err;
    }

    // Initialize balances
    const balances = {};
    group.members.forEach(member => {
        balances[member._id.toString()] = {
            userId: member._id,
            username: member.username,
            netBalance: 0
        };
    });

    const expenses = await Expense.find({ group: groupId });

    expenses.forEach(exp => {
        const payerIdStr = exp.paidBy.toString();
        const amount = exp.amount;
        const splitAmong = exp.splitAmong;
        const splitCount = splitAmong.length;

        if (splitCount > 0) {
            const share = amount / splitCount;

            if (balances[payerIdStr]) {
                balances[payerIdStr].netBalance += amount;
            }

            splitAmong.forEach(memberId => {
                const memberIdStr = memberId.toString();
                if (balances[memberIdStr]) {
                    balances[memberIdStr].netBalance -= share;
                }
            });
        }
    });

    const balanceList = Object.values(balances).map(b => ({
        ...b,
        netBalance: parseFloat(b.netBalance.toFixed(2))
    }));

    const debtors = [];
    const creditors = [];

    balanceList.forEach(user => {
        if (user.netBalance < -0.01) {
            debtors.push({ ...user });
        } else if (user.netBalance > 0.01) {
            creditors.push({ ...user });
        }
    });

    debtors.sort((a, b) => a.netBalance - b.netBalance);
    creditors.sort((a, b) => b.netBalance - a.netBalance);

    const settlementTransactions = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
        const debtor = debtors[dIdx];
        const creditor = creditors[cIdx];

        const oweAmount = Math.abs(debtor.netBalance);
        const owedAmount = creditor.netBalance;

        const settleAmount = Math.min(oweAmount, owedAmount);

        settlementTransactions.push({
            fromUserId: debtor.userId,
            fromUsername: debtor.username,
            toUserId: creditor.userId,
            toUsername: creditor.username,
            amount: parseFloat(settleAmount.toFixed(2))
        });

        debtor.netBalance += settleAmount;
        creditor.netBalance -= settleAmount;

        if (Math.abs(debtor.netBalance) < 0.01) dIdx++;
        if (creditor.netBalance < 0.01) cIdx++;
    }

    return {
        balances: balanceList,
        settlements: settlementTransactions
    };
};

module.exports = {
    addExpense,
    listExpenses,
    deleteExpense,
    getBalanceStats
};
