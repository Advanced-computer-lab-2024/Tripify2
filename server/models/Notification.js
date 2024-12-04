const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    Message: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        enum: ['success', 'warning', 'error', 'info'],
        default: 'info'
    },
    Status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    },
    TargetRoute: {
        type: String,
        default: null
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);