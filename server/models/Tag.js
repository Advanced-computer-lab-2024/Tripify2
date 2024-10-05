const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    Tag: {
      type: String,
      required: true,
      enum: ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'], // Define the allowed values
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;
