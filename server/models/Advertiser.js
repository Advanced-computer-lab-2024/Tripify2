const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertiserSchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    CompanyProfile: {
      type: Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: false,
    },
    Accepted: {
      type: Boolean,
      default: null,
    },
    Document: {
      type: [String],
      required: true,
    },
    Activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    Image: {
      type: String,
    },
    Rating: {
      type: Number,
      required: true,
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

const Advertiser = mongoose.model("Advertiser", advertiserSchema);
module.exports = Advertiser;
