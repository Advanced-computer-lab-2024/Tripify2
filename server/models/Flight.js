const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: 'flight-destination'
    },
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    departureDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    price: {
        total: {
            type: Number,
            required: true
        }
    },
    links: {
        flightDates: {
            type: String,
            required: true
        },
        flightOffers: {
            type: String,
            required: true
        }
    }
}, {
  timestamps: true
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;