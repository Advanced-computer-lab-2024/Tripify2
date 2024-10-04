const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema(
  {
    Name: {
      type: String,
      require: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    Time: {
      type: Date,
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
    Price: {
      type: Number,
      required: true,
    },
    CategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    Tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    SpecialDiscounts: {
      type: Number,
    },
    AdvertiserId: {
      type: Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true,
    },
    Duration: {
      type: String,
      required: true,
    },
    Inappropriate: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
