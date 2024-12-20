const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TourismGovernorSchema = new Schema(
  {
    AddedPlaces: [{
      type: Schema.Types.ObjectId,
      ref: "Place",
    }],
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    AddedTags: [{
      type: Schema.Types.ObjectId,
      ref: "Tag",
      default: [],
    }],
  },
  {
    timestamps: true,
  }
);

const TourismGovernor = mongoose.model(
  "TourismGovernor",
  TourismGovernorSchema
);
module.exports = TourismGovernor;
