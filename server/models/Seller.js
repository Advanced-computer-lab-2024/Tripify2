const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true
  },
  UserId: {
    type: String,
    //ref: 'User',
    required: true,
  },
  Accepted: {
    type: Boolean,
    default: null
  },
  Documents: {
    type: [String], 
    required: true, 
  }
}, { timestamps: true });

const Seller = mongoose.model('Seller', SellerSchema);
module.exports = Seller;