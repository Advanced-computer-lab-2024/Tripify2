const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    Tag: {
      type: String,
      required: true,
      enum: ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'], // Define the allowed values
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;
