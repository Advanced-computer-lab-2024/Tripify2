const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertiserSchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Website: {
      type: String,
      required: true,
    },
    Hotline: {
      type: String,
      required: true,
    },
    Profile: {
      type: String,
      required: true,
    },
    Accepted: {
      type: Boolean,
      default: null,
    },
    Document: {
      type: [String],
      required: true,
    },
    inappropriate: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

const Advertiser = mongoose.model("Advertiser", advertiserSchema);
module.exports = Advertiser;
