const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  UserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;