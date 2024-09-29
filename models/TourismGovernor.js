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
    AddedPlaces: {
      //names of all created places (Names of created places MUST be unqiue)
      type: [String],
    },
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
