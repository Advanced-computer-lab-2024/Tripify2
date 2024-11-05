const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  chainCode: String,
  iataCode: String,
  dupeId: Number,
  name: String,
  hotelId: { type: String, unique: true },
  geoCode: {
    latitude: Number,
    longitude: Number
  },
  address: {
    countryCode: String
  },
  lastUpdate: Date,
  amenities: [String],
  rating: Number,
  description: String,
  offers: [{
    id: String,
    checkInDate: Date,
    checkOutDate: Date,
    rateCode: String,
    room: {
      type: { type: String }, // Changed this line
      typeEstimated: {
        beds: Number,
        bedType: String
      },
      description: String
    },
    guests: {
      adults: Number
    },
    price: {
      currency: String,
      base: String,
      total: String
    },
    policies: {
      cancellations: [{
        deadline: Date,
        amount: String
      }],
      paymentType: String
    }
  }]
});

module.exports = mongoose.model('Hotel', HotelSchema);