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
    CompanyProfile: {
      type: Schema.Types.ObjectId,
      ref: "CompanyProfile",
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
  },
  { timestamps: true }
);

const Advertiser = mongoose.model("Advertiser", advertiserSchema);
module.exports = Advertiser;
