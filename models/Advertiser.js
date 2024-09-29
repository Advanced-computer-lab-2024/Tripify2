const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertiserSchema = new Schema({
  UserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
    Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  Website: {
    type: String,
    required: true,
  },
  Hotline: {
    type: String,
    required: true
  },
  Profile: {
    type: String,
    required: true,
  },
  Accepted: {
    type: Boolean,
    required: true,
    default: null
  }
}, { timestamps: true });

const Advertiser = mongoose.model('Advertiser', advertiserSchema);
module.exports = Advertiser;