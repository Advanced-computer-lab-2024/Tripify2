const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceSchema = new Schema(
  {
    Name: {
      type: String,
      required: [true, "Please enter a name for the place"],
    },
    Type: {
      type: String,
      //enum: ["museum", "historical-place"], //amlenha fel tags attribute
      required: [true, "Please enter a type for the place"],
    },
    //Category: {}, e3tabartaha heya heya el tags
    Description: {
      type: String,
      required: [true, "Please enter a discription for the place"],
    },
    Location: {
      type: String,
      required: [true, "Please set a location to the place"],
    },
    Pictures: {
      type: [String],
      required: [true, "Please upload picture(s) for the place"],
    },
    OpeningHours: {
      type: String, //9:00 AM masalan
      required: [true, "Please state the opening hours of the place"],
    },
    TicketPrices: {
      type: Map, // "foreginer": 50, "native": 20, "student": 10,
      of: Number, //keda el values of number datatype
      required: [true, "Please state the ticket prices of the place"],
    },
    Tags: {
      type: [Schema.Types.ObjectId],
      ref: "Tag",
      required: [true, "Please set tags for the place"],
    },
    Categories: {
      type: [Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "Please set categories for the place"],
    },
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;
