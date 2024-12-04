const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NotificationService = require('../config/notification.service');
const Tourist = require("./Tourist");

const ItinerarySchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Activities: [
      {
        type: { type: String, required: true },
        duration: { type: Number, required: true },
      },
    ],
    TourGuide: {
      type: Schema.Types.ObjectId,
      ref: "TourGuide",
      required: true,
    },
    Location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    StartDate: {
      type: Date,
      required: true,
    },
    EndDate: {
      type: Date,
      required: true,
    },
    Language: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    DatesAndTimes: [
      {
        type: Date,
        required: true,
      },
    ],
    Accesibility: {
      type: Boolean,
      required: true,
    },
    Pickup: {
      type: String,
      required: true,
    },
    Dropoff: {
      type: String,
      required: true,
    },
    Category: [
      { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    Tag: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    Inappropriate: {
      type: Boolean,
      default: false,
    },
    Image: {
      type: String,
      required: true,
    },
    Rating: {
      type: String,
      required: true,
    },
    RemainingBookings: {
      type: Number,
      required: true,
      default: 0,
    },
    Reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

ItinerarySchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    this.options._previousAccess = docToUpdate.Accesibility;
    this.options._previousBookings = docToUpdate.RemainingBookings;
  }
});

ItinerarySchema.post('findOneAndUpdate', async function (doc) {
  try {
    const notificationService = new NotificationService();

    if (this.options._previousAccess === false && doc.Accesibility === true) {
      const users = await Tourist.find({
        BookmarkedItinerary: { $in: [doc._id] }
      });

      console.log(users);

      users.forEach(async (user) => {
        await notificationService.createNotification({
          UserId: user.UserId.toString(),
          Type: 'info',
          Message: `The itinerary "${doc.Name}" is now available!`,
          TargetRoute: '/itinerary/' + doc._id
        });
      });
    }

    if (this.options._previousBookings === 0 && doc.RemainingBookings > 0) {
      const users = await Tourist.find({
        BookmarkedItinerary: { $in: [doc._id] }
      });

      users.forEach(async (user) => {
        await notificationService.createNotification({
          UserId: user.UserId.toString(),
          Type: 'info',
          Message: `New spots available for "${doc.Name}"! ${doc.RemainingBookings} spots left.`,
          TargetRoute: '/itinerary/' + doc._id
        });
      });
    }
  } catch (error) {
    console.error('Error in notification middleware:', error);
  }
});

const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
module.exports = Itinerary;
