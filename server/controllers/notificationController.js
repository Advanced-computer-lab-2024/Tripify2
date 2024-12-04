const NotificationService = require('../config/notification.service');
const notificationService = new NotificationService();

async function getNotifications(req, res) {
    try {
        const notifications = await notificationService.getNotifications(req._id);
        res.status(200).json({ notifications });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function markAsRead(req, res) {
    try {
        const notification = await notificationService.markAsRead(req.params.id, req._id);
        res.status(200).json({ notification });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getNotifications,
    markAsRead
}