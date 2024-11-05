const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Body: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "Resolved"],
      required: true,
    },
    Replies: [
        {
            UserId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            Reply: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", ComplaintSchema);
module.exports = Complaint;