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
    UpcomingPlaces: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place",
        default: [],
      },
    ],
    UpcomingActivities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
        default: [],
      },
    ],
    UpcomingItineraries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Itinerary",
        default: [],
      },
    ],
    Wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
    LoyaltyPoints: {
      type: Number,
      default: 0,
    },
    TotalLoyaltyPoints: {
      type: Number,
      default: 0,
    },
    Badge: {
      type: String,
      default: "Bronze",
    },
    Address: [
      {
        name: {
          type: String,
          unique: true,
          required: true,
        },
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
    ],
    BookmarkedItinerary: [
      {
        type: Schema.Types.ObjectId,
        ref: "Itinerary",
        required: true,
      },
    ],
    BookmarkedActivity: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
        required: true,
      },
    ],
    Cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", TouristSchema);
module.exports = Tourist;
