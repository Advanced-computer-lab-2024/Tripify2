const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TouristSchema = new Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    MobileNumber: {
      type: String,
      required: true,
    },
    Nationality: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    Occupation: {
      type: String,
      required: true,
    },
    Wallet: {
      type: String,
      required: true,
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    UpcomingPlaces: [{
      type: Schema.Types.ObjectId,
      ref: "Place",
      default: [],
    }],
    UpcomingActivities: [{
      type: Schema.Types.ObjectId,
      ref: "Activity",
      default: [],
    }],
    UpcomingItineraries: [{
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
      default: [],
    }],
    Wishlist: [{
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    }],
  },
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", TouristSchema);
module.exports = Tourist;
