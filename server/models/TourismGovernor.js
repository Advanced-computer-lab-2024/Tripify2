const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TourismGovernorSchema = new Schema(
  {
    Name: {
      type: String,
      unique: true,
      required: [true, "Please enter a username"],
    },
    Password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    AddedPlaces: [{
        type: Schema.Types.ObjectId,
        ref: "Place",
        required: true,
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
