const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema(
  {
    Date: {
      type: Date,
      required: true,
    },
    Time: {
      type: String,
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
    CategoryId: {
      type: Number,
      required: true,
    },
    Tags: {
      type: String,
      required: true,
    },
    SpecialDiscounts: {
      type: Number,
      required: true,
    },
    AdvertiserId: {
      type: Schema.Types.ObjectId,
      ref: 'Advertiser Id',
      required: true,
    },
    Duration: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
