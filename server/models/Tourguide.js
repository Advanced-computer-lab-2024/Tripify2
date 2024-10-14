const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TourGuideSchema = new Schema(
  {
    MobileNumber: {
      type: Number,
      required: true,
    },
    YearsOfExperience: {
      type: Number,
      required: true,
    },
    PreviousWork: {
      type: String,
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Accepted: {
      type: Boolean,
      default: null
    },
    Documents: {
      type: [String], 
      required: true, 
    },
    Itineraries: [{
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
    }],
    Image: {
      type: String,
    },
  },
  { timestamps: true }
);

const TourGuide = mongoose.model("TourGuide", TourGuideSchema);
module.exports = TourGuide;
