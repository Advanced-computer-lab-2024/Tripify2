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
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    CategoryId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    Tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
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
    Image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
