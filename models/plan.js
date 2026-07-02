const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    category: {
        type: String,
        enum: ['travel', 'lodging', 'activity', 'food', 'function_event', 'other'],
        default: 'other'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Plan', PlanSchema);
