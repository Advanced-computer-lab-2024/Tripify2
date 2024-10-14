const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
  Description: {
    type: String,
    required: true
  },
  UserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  Products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  Image: {
    type: String,
  },
}, { timestamps: true });

const Seller = mongoose.model('Seller', SellerSchema);
module.exports = Seller;