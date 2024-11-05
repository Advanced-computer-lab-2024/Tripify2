const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Review: {
      type: String,
      required: true,
    },
    Rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;