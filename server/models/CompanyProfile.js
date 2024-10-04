const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companyProfileSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Industry: {
      type: String,
      required: true,
    },
    FoundedDate: {
      type: Date,
    },
    Headquarters: {
      type: String,
    },
    Description: {
      type: String,
      required: true,
    },
    Website: {
      type: String,
    },
    Email: {
      type: String,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("CompanyProfile", companyProfileSchema);
module.exports = Profile;
