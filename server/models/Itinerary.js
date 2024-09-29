const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItinerarySchema = new Schema(
  {
    Activities: [
      {
        Activity: {
          type: Schema.Types.ObjectId,
          /*type: String,*/
          ref: "Activity",
        },
        duration: Number,
      },
    ],
    TourGuide: {
      type: Schema.Types.ObjectId,
      // type: String,
      ref: "TourGuide",
      required: true,
    },
    Locations: [
      {
        type: String,
        required: true,
      },
    ],
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
    Category: {
      type: String,
      required: true,
    },
    Tag: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
module.exports = Itinerary;
