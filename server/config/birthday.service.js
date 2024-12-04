const NotificationService = require("./notification.service");
const PromoCode = require("../models/PromoCode");
const Tourist = require("../models/Tourist");

class BirthdayService {
  constructor() {
    this.notificationService = new NotificationService();
  }

  async checkAndSendBirthdayPromoCodes() {
    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();

      console.log(`currentDay: ${currentDay}`);
      console.log(`currentMonth: ${currentMonth}`);

      const birthdayTourists = await Tourist.find({
        $expr: {
          $and: [
            { $eq: [{ $month: "$DOB" }, currentMonth] },
            { $eq: [{ $dayOfMonth: "$DOB" }, currentDay] },
          ],
        },
      }).populate("UserId", "Email");

      console.log(
        `Found ${birthdayTourists.length} tourists with birthdays today`
      );

      for (const tourist of birthdayTourists) {
        await this.createBirthdayPromoAndNotify(tourist);
      }

      console.log("Birthday promo codes sent successfully");
    } catch (error) {
      console.error("Error in birthday service:", error);
    }
  }

  async createBirthdayPromoAndNotify(tourist) {
    try {
      const promoCode = `BDAY${tourist.UserId._id
        .toString()
        .slice(-6)}${new Date().getFullYear()}`;

      await PromoCode.create({
        Code: promoCode,
        Type: "percentage",
        Value: 25,
        ApplicableToAll: false,
        EligibleUsers: [tourist.UserId],
      });

      await this.notificationService.createNotification({
        UserId: tourist.UserId._id,
        Type: "success",
        Message: `Happy Birthday! 🎉 Here's your special birthday gift: Use code ${promoCode} for 25% off your purchase today!`,
      });

      await this.notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "🎂 Happy Birthday from Tripify!",
        content: `
                    <h2>Happy Birthday, ${tourist.UserName}! 🎉</h2>
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <p style="font-size: 16px;">To celebrate your special day, we're giving you a special birthday discount!</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="font-size: 18px; font-weight: bold; margin: 0;">Your Birthday Promo Code:</p>
                            <p style="font-size: 24px; color: #007bff; font-weight: bold; margin: 10px 0;">${promoCode}</p>
                            <p style="font-size: 16px; margin: 0;">Get 25% off your purchase when you use this code today!</p>
                        </div>
                        <p style="font-size: 14px; color: #6c757d;">This offer is exclusively for you and expires at midnight tonight.</p>
                        <p style="margin-top: 20px;">Enjoy your special day!</p>
                        <hr style="margin: 20px 0;">
                        <p style="font-size: 14px; color: #6c757d;">Best wishes,<br>The Tripify Team</p>
                    </div>
                `,
      });

      console.log(
        `Birthday promo code ${promoCode} created and sent to tourist ${tourist.UserName}`
      );
    } catch (error) {
      console.error(
        `Error processing birthday promotion for tourist ${tourist.UserName}:`,
        error
      );
    }
  }
}

module.exports = BirthdayService;
