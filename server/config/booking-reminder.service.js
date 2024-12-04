const mongoose = require('mongoose');
const { ItineraryBooking, ActivityBooking } = require('../models/Booking');
const NotificationService = require('./notification.service');

class BookingReminderService {
    constructor() {
        this.notificationService = new NotificationService();
    }

    async checkAndSendReminders() {
        try {
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

            twoDaysFromNow.setHours(0, 0, 0, 0);
            const endOfDay = new Date(twoDaysFromNow);
            endOfDay.setHours(23, 59, 59, 999);

            const upcomingItineraries = await ItineraryBooking.find({
                Status: 'Confirmed',
                ItineraryStartDate: {
                    $gte: twoDaysFromNow,
                    $lte: endOfDay
                }
            }).populate('UserId', 'Email UserName')
                .populate('ItineraryId', 'Name');

            const upcomingActivities = await ActivityBooking.find({
                Status: 'Confirmed',
                ActivityDate: {
                    $gte: twoDaysFromNow,
                    $lte: endOfDay
                }
            }).populate('UserId', 'Email UserName')
                .populate('ActivityId', 'Name');

            for (const booking of upcomingItineraries) {
                await this.sendBookingReminder({
                    user: booking.UserId,
                    bookingType: 'itinerary',
                    startDate: booking.ItineraryStartDate,
                    bookingName: booking.ItineraryId.Name
                });
            }

            for (const booking of upcomingActivities) {
                await this.sendBookingReminder({
                    user: booking.UserId,
                    bookingType: 'activity',
                    startDate: booking.ActivityDate,
                    bookingId: booking._id,
                    activityName: booking.ActivityId.Name
                });
            }

            console.log('Reminder check completed successfully');
        } catch (error) {
            console.error('Error in reminder service:', error);
        }
    }

    async sendBookingReminder({ user, bookingType, startDate, activityName = null, bookingName = null }) {
        const formattedDate = startDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const message = bookingType === 'itinerary'
            ? `Your itinerary "${bookingName}" booking starts in 2 days on ${formattedDate}. Get ready for your adventure!`
            : `Your activity "${activityName}" is scheduled for ${formattedDate}. Don't forget to attend!`;

        await this.notificationService.createNotification({
            UserId: user._id,
            Message: message,
            Type: 'info',
            Status: 'unread',
        });

        await this.notificationService.sendEmail({
            recipientEmail: user.Email,
            subject: `Reminder: Upcoming ${bookingType} booking`,
            content: `
                <h2>Booking Reminder</h2>
                <p>Hello ${user.UserName},</p>
                <p>${message}</p>
                <p>If you need to make any changes to your booking, please contact our support team.</p>
                <p>Have a great time!</p>
            `
        });
    }
}

module.exports = BookingReminderService;