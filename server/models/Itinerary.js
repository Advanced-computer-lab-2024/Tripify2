const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    }
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
module.exports = Itinerary;
