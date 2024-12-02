const Notification = require('../models/Notification');
const socket = require('./socket');
const nodemailer = require('nodemailer');

class NotificationService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async createNotification(data) {
        try {
            const notification = new Notification(data);
            await notification.save();

            socket.emit(data.UserId.toString(), 'newNotification', notification);

            return notification;
        } catch (error) {
            throw error;
        }
    }

    async getNotifications(UserId, page = 1, limit = 10) {
        try {
            const notifications = await Notification.find({ UserId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            return notifications;
        } catch (error) {
            throw error;
        }
    }

    async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification.findByIdAndUpdate(
                { _id: notificationId, UserId: userId },
                { Status: 'read' },
                { new: true }
            );
            return notification;
        } catch (error) {
            throw error;
        }
    }

    async sendEmail({ recipientEmail, subject, content }) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: [recipientEmail],
                subject: subject,
                html: content
            };

            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async sendOTPEmail({ email, otp }) {
        try {
            const content = `
                <h2>Password Reset Request</h2>
                <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this password reset, please ignore this email.</p>
            `;

            await this.sendEmail({
                recipientEmail: [email],
                subject: 'Password Reset OTP',
                content
            });
        } catch (error) {
            console.error('Error sending OTP email:', error);
            throw error;
        }
    }
}

module.exports = NotificationService;