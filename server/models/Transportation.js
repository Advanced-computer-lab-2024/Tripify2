const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransportationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Car", "Bus", "Van", "Limousine"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    images: [{
        type: String
    }],
    features: [{
        type: String
    }],
    location: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Transportation = mongoose.model("Transportation", TransportationSchema);
module.exports = Transportation;