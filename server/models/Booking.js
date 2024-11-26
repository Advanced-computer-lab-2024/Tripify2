const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      required: true,
    },
    TotalPaid: {
      type: Number,
      required: true,
    },
    Currency: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  }
);

const Booking = mongoose.model("Booking", BookingSchema);

const ItineraryBooking = Booking.discriminator(
  "itinerary",
  new Schema({
    ItineraryId: {
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
      required: true,
    },
    Participants: {
      type: Number,
      required: true,
    },
    ItineraryStartDate: {
      type: Date,
      required: true,
    },
    ItineraryEndDate: {
      type: Date,
      required: true,
    },
  })
);

const ActivityBooking = Booking.discriminator(
  "activity",
  new Schema({
    ActivityId: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    Participants: {
      type: Number,
      required: true,
    },
    ActivityDate: {
      type: Date,
      required: true,
    },
  })
);

const FlightBooking = Booking.discriminator(
  "flight",
  new Schema({
    FlightId: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    NumberSeats: {
      type: Number,
      required: true,
    },
  })
);

const HotelBooking = Booking.discriminator(
  "hotel",
  new Schema({
    HotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    OfferId: {
      type: String,
      required: true,
    },
  })
);

const ProductBooking = Booking.discriminator(
  "product",
  new Schema({
    Products: [
      {
        ProductId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        Quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    PaymentMethod: {
      type: String,
      enum: ["credit-card", "wallet", "cash-on-delivery"],
      required: true,
    },
  })
);

const TransportationBooking = Booking.discriminator(
  "transportation",
  new Schema({
    TransportationId: {
      type: Schema.Types.ObjectId,
      ref: "Transportation",
      required: true,
    },
    StartDate: {
      type: Date,
      required: true,
    },
    EndDate: {
      type: Date,
      required: true,
    },
    PickupLocation: {
      type: String,
      required: true,
    },
    DropoffLocation: {
      type: String,
      required: true,
    },
  })
);

module.exports = {
  Booking,
  ItineraryBooking,
  ActivityBooking,
  FlightBooking,
  HotelBooking,
  ProductBooking,
  TransportationBooking,
};
