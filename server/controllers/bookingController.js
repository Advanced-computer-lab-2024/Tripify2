const {
  ItineraryBooking,
  ActivityBooking,
  ProductBooking,
  FlightBooking,
  HotelBooking,
  TransportationBooking,
} = require("../models/Booking.js");
const ItineraryModel = require("../models/Itinerary.js");
const TouristModel = require("../models/Tourist.js");
const ActivityModel = require("../models/Activity.js");
const ProductModel = require("../models/Product.js");
const FlightModel = require("../models/Flight.js");
const HotelModel = require("../models/Hotel.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const { convertPrice, convertToUSD } = require("../config/currencyHelpers.js");
const Transportation = require("../models/Transportation.js");

// const usdToEur = 0.92;
// const usdToEgp = 50;

// const convertPrice = (price, currency) => {
//   if(currency === 'USD') return price;
//   if(currency === 'EUR') return (price * usdToEur).toFixed(2);
//   if(currency === 'EGP') return (price * usdToEgp).toFixed(2);
//   return price;
// }

// const convertToUSD = (price, currency) => {
//     if(currency === 'USD') return price;
//     if(currency === 'EUR') return (price / usdToEur).toFixed(2);
//     if(currency === 'EGP') return (price / usdToEgp).toFixed(2);
//     return price;
// }

const getMyItineraryBookings = async (req, res) => {
  try {
    const bookings = await ItineraryBooking.find({
      UserId: req._id,
      Status: "Confirmed",
    }).populate("ItineraryId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};
const getallItineraryBookings = async (req, res) => {
  try {
    const bookings = await ItineraryBooking.find({
      Status: "Confirmed",
    }).populate("ItineraryId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }

  };
  
  const getItineraryBookingsById = async (req, res) => {
    const { id } = req.params; 
    try {
      const bookings = await ItineraryBooking.find({
        "ItineraryId": id,
        Status: "Confirmed",   
      });
      if (!bookings || bookings.length === 0) {
        return res.status(200).json({Participants: 0 });
        
      }
      const Participants = bookings.reduce((sum, booking) => sum + (booking.Participants || 0), 0);
      res.status(200).json({
        Participants
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  };
    const getActivityBookingsById = async (req, res) => {
    const { id } = req.params; 
    try {
      const bookings = await   ActivityBooking.find({
        "ActivityId": id,
        Status: "Confirmed",   
      });
      if (!bookings || bookings.length === 0) {
        return res.status(200).json({Participants: 0 });
        
      }
      const Participants = bookings.reduce((sum, booking) => sum + (booking.Participants || 0), 0);
      res.status(200).json({
        Participants
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  };
  
const getSingleItineraryBooking = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const booking = await ItineraryBooking.findById(id).populate({
      path: "ItineraryId",
      populate: [
        {
          path: "Reviews",
          populate: {
            path: "UserId",
          },
        },
        {
          path: "TourGuide",
          populate: [
            {
              path: "UserId",
            },
            {
              path: "Reviews",
              populate: {
                path: "UserId",
              },
            },
          ],
        },
      ],
    });

    console.log(booking);

    if (booking.UserId.toString() !== req._id.toString()) {
      return res.status(400).json({ msg: "Unauthorized" });
    }

    res.status(200).json(booking);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const createItineraryBooking = async (req, res) => {
  const { id } = req.params;
  const { currency, Participants } = req.body;

  try {
    const itinerary = await ItineraryModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    const totalPrice =
      Number(convertPrice(itinerary.Price, currency)) * Participants;
    const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    const walletDeduction = Math.min(walletBalance, totalPrice);
    const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    if (itinerary.RemainingBookings < Participants) {
      return res.status(400).json({ msg: "Not enough spots left" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: itinerary.Name,
            },
            unit_amount: Math.round((remainingPrice * 100) / Participants),
          },
          quantity: Participants,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/itineraries/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/itineraries/${id}`,
      metadata: {
        ItineraryId: id,
        UserId: req._id,
        Participants,
        ItineraryStartDate: itinerary.StartDate.toDateString(),
        ItineraryEndDate: itinerary.EndDate.toDateString(),
        currency,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const cancelItineraryBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await ItineraryBooking.findById(id);

    if (booking.UserId.toString() !== req._id.toString()) {
      return res.status(400).json({ msg: "Unauthorized" });
    }

    if (booking.Status !== "Confirmed") {
      return res.status(400).json({ msg: "Booking not confirmed yet" });
    }

    await ItineraryBooking.findByIdAndUpdate(id, { Status: "Cancelled" });

    await ItineraryModel.findByIdAndUpdate(booking.ItineraryId, {
      $inc: { RemainingBookings: booking.Participants },
    });

    res.status(200).json({ msg: "Booking cancelled" });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const createActivityBooking = async (req, res) => {
  const { id } = req.params;
  const { currency, Participants } = req.body;

  try {
    const activity = await ActivityModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    console.log(activity);

    const totalPrice =
      Number(
        convertPrice(
          activity.Price * ((100 - activity.SpecialDiscounts) / 100),
          currency
        )
      ) * Participants;
    const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    const walletDeduction = Math.min(walletBalance, totalPrice);
    const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: activity.Name,
            },
            unit_amount: Math.round((remainingPrice * 100) / Participants),
          },
          quantity: Participants,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/activities/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/activities/${id}`,
      metadata: {
        ActivityId: id,
        UserId: req._id,
        Participants,
        ActivityDate: activity.Date.toDateString(),
        currency,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const cancelActivityBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await ActivityBooking.findById(id);

    if (booking.UserId.toString() !== req._id.toString()) {
      return res.status(400).json({ msg: "Unauthorized" });
    }

    if (booking.Status !== "Confirmed") {
      return res.status(400).json({ msg: "Booking not confirmed yet" });
    }

    await ActivityBooking.findByIdAndUpdate(id, { Status: "Cancelled" });

    res.status(200).json({ msg: "Booking cancelled" });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getMyActivityBookings = async (req, res) => {
  try {
    const bookings = await ActivityBooking.find({
      UserId: req._id,
      Status: "Confirmed",
    }).populate("ActivityId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};
const getallActivityBookings = async (req, res) => {
  try {
    const bookings = await ActivityBooking.find({
      Status: "Confirmed",
    }).populate("ActivityId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const updateQuantityProductAndStatus = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await ProductBooking.findById(orderId).populate(
      "Products.ProductId"
    );

    if (!order)
      return res
        .status(404)
        .json({ message: `No order found with id: ${orderId}` });

    for (const product of order.Products) {
      const productId = product.ProductId._id;
      const quantity = product.Quantity;

      if (!productId)
        return res.status(400).json({ message: "ProductId not found!" });

      const productInDb = await ProductModel.findByIdAndUpdate(
        productId,
        {
          AvailableQuantity: product.ProductId.AvailableQuantity - quantity,
          TotalSales: product.ProductId.TotalSales + quantity,
        },
        { new: true }
      );

      if (!productInDb)
        return res
          .status(404)
          .json({ message: `No product found with id ${productId}` });
    }

    const orderUpdateStatus = await ProductBooking.findByIdAndUpdate(
      orderId,
      {
        Status: "Confirmed",
      },
      { new: true }
    );

    //clear user cart here!
    const touristId = order?.UserId;
    if (!touristId)
      return res
        .status(404)
        .json({ message: `Tourist with id ${touristId} not found!` });

    await TouristModel.findByIdAndUpdate(
      touristId,
      {
        Cart: [],
      },
      { new: true }
    );

    if (!orderUpdateStatus)
      return res
        .status(400)
        .json({ message: `Failed to update order's status` });

    res.status(200).json(orderUpdateStatus);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getMyProductBookings = async (req, res) => {
  try {
    // const bookings = await ProductBooking.find({
    //   UserId: "6740fa4d389bfefab0fae094",
    // });
    const userId = req?.query?.UserId;

    //console.log(`======================${userId}`);

    if (!userId)
      return res
        .status(400)
        .json({ message: "UserId query parameter is required" });

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const bookings = await ProductBooking.find({
      UserId: userId,
      $or: [
        { Status: "Confirmed", createdAt: { $lte: oneMinuteAgo } },
        { Status: "Pending", createdAt: { $lte: oneMinuteAgo } },
        { Status: "Cancelled" },
      ],
    }).populate({
      path: "Products.ProductId",
      populate: {
        path: "Reviews",
        populate: {
          path: "UserId",
        },
      },
    });
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getMyCurrentProductBookings = async (req, res) => {
  try {
    // const bookings = await ProductBooking.find({
    //   UserId: "6740fa4d389bfefab0fae094",
    // });
    const userId = req?.query?.UserId;

    //console.log(`======================${userId}`);

    if (!userId)
      return res
        .status(400)
        .json({ message: "UserId query parameter is required" });

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const bookings = await ProductBooking.find({
      UserId: userId,
      //Status: { $in: ["Confirmed", "Pending"] },
      $or: [
        { Status: "Confirmed", createdAt: { $gt: oneMinuteAgo } },
        { Status: "Pending", createdAt: { $gt: oneMinuteAgo } },
      ],
    }).populate({
      path: "Products.ProductId",
      populate: {
        path: "Reviews",
        populate: {
          path: "UserId",
        },
      },
    });
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getSingleActivityBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await ActivityBooking.findById(id).populate({
      path: "ActivityId",
      populate: [
        {
          path: "Reviews",
          populate: {
            path: "UserId",
          },
        },
        {
          path: "AdvertiserId",
          populate: [
            {
              path: "UserId",
            },
            {
              path: "Reviews",
              populate: {
                path: "UserId",
              },
            },
          ],
        },
      ],
    });

    if (booking.UserId.toString() !== req._id.toString()) {
      return res.status(400).json({ msg: "Unauthorized" });
    }

    res.status(200).json(booking);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const acceptBooking = async (req, res) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    // console.error('Webhook Error:', err.message);
    // return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event);

  if (req.body.type === "checkout.session.completed") {
    const session = payload.data.object;
    const metadata = session.metadata;

    if (metadata.ItineraryId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

      const itinerary = await ItineraryModel.findByIdAndUpdate(
        metadata.ItineraryId,
        [
          {
            $set: {
              RemainingBookings: {
                $cond: {
                  if: {
                    $gte: [
                      "$RemainingBookings",
                      parseInt(metadata.Participants),
                    ],
                  },
                  then: {
                    $subtract: [
                      "$RemainingBookings",
                      parseInt(metadata.Participants),
                    ],
                  },
                  else: "$RemainingBookings",
                },
              },
            },
          },
        ],
        { new: true }
      );

      await ItineraryBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        ItineraryId: metadata.ItineraryId,
        Participants: metadata.Participants,
        ItineraryStartDate: new Date(metadata.ItineraryStartDate),
        ItineraryEndDate: new Date(metadata.ItineraryEndDate),
        Currency: session.currency.toUpperCase(),
      });

      const totalPaidInUSD = convertToUSD(
        session.amount_total / 100,
        session.currency.toUpperCase()
      );

      const totalLoyaltyPointsEarned =
        totalPaidInUSD *
        (tourist.Badge === "Gold" ? 1.5 : tourist.Badge === "Silver" ? 1 : 0.5);
      const newTotalLoayltyPoints =
        tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
      const newLoayltyPointsEarned =
        tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
      const newBadge =
        newTotalLoayltyPoints >= 500000
          ? "Gold"
          : newTotalLoayltyPoints >= 100000
          ? "Silver"
          : "Bronze";

      await TouristModel.findByIdAndUpdate(tourist._id, {
        $set: {
          LoyaltyPoints: newLoayltyPointsEarned,
          TotalLoyaltyPoints: newTotalLoayltyPoints,
          Badge: newBadge,
          Wallet: "0.00",
        },
      });

      // Update itinerary status
      // const [itinerary, _] = await Promise.all([
      //     await ItineraryModel.findByIdAndUpdate(
      //         metadata.ItineraryId,
      //         [
      //             {
      //                 $set: {
      //                     RemainingBookings: {
      //                         $cond: {
      //                             if: { $gte: ["$RemainingBookings", parseInt(metadata.Participants)] },
      //                             then: { $subtract: ["$RemainingBookings", parseInt(metadata.Participants)] },
      //                             else: "$RemainingBookings"
      //                         }
      //                     }
      //                 }
      //             }
      //         ],
      //         { new: true }
      //     ),
      //     await ItineraryBooking.create({
      //         UserId: metadata.UserId,
      //         Status: 'Confirmed',
      //         TotalPaid: session.amount_total,
      //         ItineraryId: metadata.ItineraryId,
      //         Participants: metadata.Participants,
      //         ItineraryStartDate: new Date(metadata.ItineraryStartDate),
      //         ItineraryEndDate: new Date(metadata.ItineraryEndDate),
      //         Currency: session.currency.toUpperCase()
      //     })
      // ])

      console.log(itinerary, metadata);

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.ActivityId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

      await ActivityBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        ActivityId: metadata.ActivityId,
        Participants: metadata.Participants,
        ActivityDate: new Date(metadata.ActivityDate),
        Currency: session.currency.toUpperCase(),
      });

      const totalPaidInUSD = convertToUSD(
        session.amount_total / 100,
        session.currency.toUpperCase()
      );

      const totalLoyaltyPointsEarned =
        totalPaidInUSD *
        (tourist.Badge === "Gold" ? 1.5 : tourist.Badge === "Silver" ? 1 : 0.5);
      const newTotalLoayltyPoints =
        tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
      const newLoayltyPointsEarned =
        tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
      const newBadge =
        newTotalLoayltyPoints >= 500000
          ? "Gold"
          : newTotalLoayltyPoints >= 100000
          ? "Silver"
          : "Bronze";

      await TouristModel.findByIdAndUpdate(tourist._id, {
        $set: {
          LoyaltyPoints: newLoayltyPointsEarned,
          TotalLoyaltyPoints: newTotalLoayltyPoints,
          Badge: newBadge,
          Wallet: "0.00",
        },
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.ProductId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

      await ProductBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        ProductId: metadata.ProductId,
        Quantity: metadata.Quantity,
        Currency: session.currency.toUpperCase(),
      });

      await ProductModel.findByIdAndUpdate(
        metadata.ProductId,
        [
          {
            $set: {
              AvailableQuantity: {
                $cond: {
                  if: {
                    $gte: ["$AvailableQuantity", parseInt(metadata.Quantity)],
                  },
                  then: {
                    $subtract: [
                      "$AvailableQuantity",
                      parseInt(metadata.Quantity),
                    ],
                  },
                  else: "$AvailableQuantity",
                },
              },
              TotalSales: {
                $add: ["$TotalSales", parseInt(metadata.Quantity)],
              },
            },
          },
        ],
        { new: true }
      );

      const totalPaidInUSD = convertToUSD(
        session.amount_total / 100,
        session.currency.toUpperCase()
      );

      const totalLoyaltyPointsEarned =
        totalPaidInUSD *
        (tourist.Badge === "Gold" ? 1.5 : tourist.Badge === "Silver" ? 1 : 0.5);
      const newTotalLoayltyPoints =
        tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
      const newLoayltyPointsEarned =
        tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
      const newBadge =
        newTotalLoayltyPoints >= 500000
          ? "Gold"
          : newTotalLoayltyPoints >= 100000
          ? "Silver"
          : "Bronze";

      await TouristModel.findByIdAndUpdate(tourist._id, {
        $set: {
          LoyaltyPoints: newLoayltyPointsEarned,
          TotalLoyaltyPoints: newTotalLoayltyPoints,
          Badge: newBadge,
          Wallet: "0.00",
        },
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.FlightId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

      await FlightBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        FlightId: metadata.FlightId,
        NumberSeats: metadata.NumberSeats,
        Currency: session.currency.toUpperCase(),
      });

      const totalPaidInUSD = convertToUSD(
        session.amount_total / 100,
        session.currency.toUpperCase()
      );

      const totalLoyaltyPointsEarned =
        totalPaidInUSD *
        (tourist.Badge === "Gold" ? 1.5 : tourist.Badge === "Silver" ? 1 : 0.5);
      const newTotalLoayltyPoints =
        tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
      const newLoayltyPointsEarned =
        tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
      const newBadge =
        newTotalLoayltyPoints >= 500000
          ? "Gold"
          : newTotalLoayltyPoints >= 100000
          ? "Silver"
          : "Bronze";

      await TouristModel.findByIdAndUpdate(tourist._id, {
        $set: {
          LoyaltyPoints: newLoayltyPointsEarned,
          TotalLoyaltyPoints: newTotalLoayltyPoints,
          Badge: newBadge,
          Wallet: "0.00",
        },
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.HotelId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

      await HotelBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        HotelId: metadata.HotelId,
        OfferId: metadata.OfferId,
        Currency: session.currency.toUpperCase(),
      });

      const totalPaidInUSD = convertToUSD(
        session.amount_total / 100,
        session.currency.toUpperCase()
      );

      const totalLoyaltyPointsEarned =
        totalPaidInUSD *
        (tourist.Badge === "Gold" ? 1.5 : tourist.Badge === "Silver" ? 1 : 0.5);
      const newTotalLoayltyPoints =
        tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
      const newLoayltyPointsEarned =
        tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
      const newBadge =
        newTotalLoayltyPoints >= 500000
          ? "Gold"
          : newTotalLoayltyPoints >= 100000
          ? "Silver"
          : "Bronze";

      await TouristModel.findByIdAndUpdate(tourist._id, {
        $set: {
          LoyaltyPoints: newLoayltyPointsEarned,
          TotalLoyaltyPoints: newTotalLoayltyPoints,
          Badge: newBadge,
          Wallet: "0.00",
        },
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.TransportationId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

      // Create transportation booking
      await TransportationBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        TransportationId: metadata.TransportationId,
        StartDate: new Date(metadata.startDate),
        EndDate: new Date(metadata.endDate),
        PickupLocation: metadata.pickupLocation,
        DropoffLocation: metadata.dropoffLocation,
        Currency: session.currency.toUpperCase(),
      });

      // Update transportation availability if needed
      await Transportation.findByIdAndUpdate(metadata.TransportationId, {
        availability: false,
      });

      // Calculate and update loyalty points
      const totalPaidInUSD = convertToUSD(
        session.amount_total / 100,
        session.currency.toUpperCase()
      );

      const totalLoyaltyPointsEarned =
        totalPaidInUSD *
        (tourist.Badge === "Gold" ? 1.5 : tourist.Badge === "Silver" ? 1 : 0.5);
      const newTotalLoayltyPoints =
        tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
      const newLoayltyPointsEarned =
        tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
      const newBadge =
        newTotalLoayltyPoints >= 500000
          ? "Gold"
          : newTotalLoayltyPoints >= 100000
          ? "Silver"
          : "Bronze";

      await TouristModel.findByIdAndUpdate(tourist._id, {
        $set: {
          LoyaltyPoints: newLoayltyPointsEarned,
          TotalLoyaltyPoints: newTotalLoayltyPoints,
          Badge: newBadge,
          Wallet: "0.00",
        },
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    }
    else if (metadata.Products) {
        const products = JSON.parse(metadata.Products);
        const sessionDB = await mongoose.startSession();
        sessionDB.startTransaction();

        const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

        await ProductBooking.create({
            UserId: metadata.UserId,
            Status: 'Confirmed',
            TotalPaid: session.amount_total,
            Products: products.map(product => ({ ProductId: product.ProductId, Quantity: product.Quantity })),
            Currency: session.currency.toUpperCase(),
            PaymentMethod: 'credit-card'
        });

        await Promise.all(products.map(async (product) => {
            await ProductModel.findByIdAndUpdate(product.ProductId, [
                {
                    $set: {
                        AvailableQuantity: {
                            $cond: {
                                if: { $gte: ["$AvailableQuantity", parseInt(product.Quantity)] },
                                then: { $subtract: ["$AvailableQuantity", parseInt(product.Quantity)] },
                                else: "$AvailableQuantity"
                            }
                        },
                        TotalSales: { 
                            $add: [
                              { $ifNull: ["$TotalSales", 0] }, 
                              parseInt(product.Quantity)
                            ]
                          }
                    }
                }
            ], { new: true })
        }))

        const totalPaidInUSD = convertToUSD(session.amount_total / 100, session.currency.toUpperCase());
        const totalLoyaltyPointsEarned = totalPaidInUSD * (tourist.Badge === 'Gold' ? 1.5 : tourist.Badge === 'Silver' ? 1 : 0.5);
        const newTotalLoayltyPoints = tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
        const newLoayltyPointsEarned = tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
        const newBadge = newTotalLoayltyPoints >= 500000 ? 'Gold' : newTotalLoayltyPoints >= 100000 ? 'Silver' : 'Bronze';

        
        await TouristModel.findByIdAndUpdate(tourist._id, {
            $set: {
            LoyaltyPoints: newLoayltyPointsEarned,
            TotalLoyaltyPoints: newTotalLoayltyPoints,
            Badge: newBadge,
            Wallet: "0.00",
            Cart: []
            },
        });

        await sessionDB.commitTransaction();
        sessionDB.endSession();
    }

    return res.status(400).json({ msg: "Invalid metadata" });
  }

  return res.status(200).json({ msg: "Event not handled" });
};

const createProductBooking = async (req, res) => {
  const { id } = req.params;
  const { currency, Quantity } = req.body;

  try {
    const product = await ProductModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    const totalPrice = Number(convertPrice(product.Price, currency)) * Quantity;
    const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    const walletDeduction = Math.min(walletBalance, totalPrice);
    const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    if (product.AvailableQuantity < Quantity) {
      return res.status(400).json({ msg: "Not enough spots left" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: product.Name,
            },
            unit_amount: Math.round((remainingPrice * 100) / Quantity),
          },
          quantity: Quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/products-tourist/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/products-tourist/${id}`,
      metadata: {
        ProductId: id,
        UserId: req._id,
        Quantity,
        currency,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const deleteAllProductBookings = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await ProductBooking.deleteMany({ UserId: id });

    if (!result.deletedCount) {
      return res
        .status(404)
        .json({ msg: "No bookings found for the given user" });
    }

    return res
      .status(200)
      .json({ msg: "All product bookings deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: e.message });
  }
};

const cancelOrderProductBooking = async (req, res) => {
  const { touristId, orderId } = req.body;

  //console.log(touristId);

  try {
    const tourist = await TouristModel.findOne({ _id: touristId }, "Wallet");

    if (!tourist)
      return res
        .status(404)
        .json({ message: `Tourist with id: ${touristId} not found` });

    //console.log("first 404");

    const order = await ProductBooking.findById(orderId);

    //console.log(`order: ${order}`);

    if (!order)
      return res
        .status(404)
        .json({ message: `Order with id: ${orderId} not found` });
    //console.log("second 404");

    if (order.Status === "Confirmed") {
      //raga3 el feloos fel wallet, zawed el products' availablequantity we raga3 el totalsales
      for (const product of order.Products) {
        const productInDb = await ProductModel.findById(product.ProductId._id);

        if (!productInDb)
          return res.status(404).json({
            message: `No product found with id ${product.ProductId._id}`,
          });
        //console.log("third 404");

        productInDb.AvailableQuantity += product.Quantity;
        productInDb.TotalSales -= product.Quantity;

        await productInDb.save();
      }

      //console.log(`tourist: ${tourist}`);
      //console.log(typeof tourist.Wallet);
      //console.log(typeof order.TotalPaid);
      tourist.Wallet = parseFloat(tourist.Wallet) + order.TotalPaid;
      await tourist.save();
    }

    const updatedBooking = await ProductBooking.findByIdAndUpdate(
      orderId,
      {
        Status: "Cancelled",
      },
      { new: true }
    );

    res.status(200).json({
      message: `Order ${orderId} cancelled successfully`,
      booking: updatedBooking,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createProductBookingCart = async (req, res) => {
  const { touristId, products, currency, paymentMethod } = req.body;

  try {
    //console.log("hereeeeeeeeeeeeeeeeee");
    //console.log(products);
    const tourist = await TouristModel.findOne({ _id: touristId }, "Wallet");

    //console.log(tourist);

    let totalPrice = 0;
    const productDetails = [];

    for (const { ProductId, Quantity } of products) {
      const product = await ProductModel.findById(ProductId);

      if (!product) {
        return res
          .status(400)
          .json({ message: `Product with ID ${ProductId} not found` });
      }
      //console.log("stops here 1");

      if (product.AvailableQuantity < Quantity) {
        return res
          .status(400)
          .json({ message: `Not enough spots left for ${product.Name}` });
      }
      //console.log("stops here 2");

      const productTotalPrice =
        Number(convertPrice(product.Price, currency)) * Quantity;
      totalPrice += productTotalPrice;

      productDetails.push({
        ProductId: product._id,
        Quantity,
        Name: product.Name,
        Price: product.Price,
      });
    }

    //console.log("stops here test 1");

    if (paymentMethod === "wallet") {
      const walletBalance = convertPrice(
        parseInt(tourist.Wallet) || 0,
        currency
      );

      //console.log("stops here test 2");
      //console.log(`walletBalance: ${walletBalance}`);
      //console.log(`typeof walletBalance: ${typeof walletBalance}`);
      //console.log(`totalPrice: ${totalPrice}`);
      //console.log(`typeof totalPrice: ${typeof totalPrice}`);

      if (walletBalance < totalPrice)
        return res.status(400).json({ message: "Insufficient wallet balance" });
      //console.log("stops here 3");

      tourist.Wallet = parseInt(tourist.Wallet) - totalPrice;

      for (const { ProductId, Quantity } of products) {
        const product = await ProductModel.findById(ProductId);
        product.AvailableQuantity -= Quantity;
        product.TotalSales += Quantity;
        await product.save();
      }

      const booking = new ProductBooking({
        UserId: touristId,
        Status: "Confirmed",
        TotalPaid: totalPrice,
        Currency: currency,
        Products: productDetails,
        PaymentMethod: paymentMethod,
      });

      await booking.save();

      tourist.Cart = [];
      await tourist.save();

      return res
        .status(200)
        .json({ message: "Payment successful via wallet", booking });
    }

    if (paymentMethod === "credit-card") {
      //console.log("inside CARDDDDDDDDDDDDDDDDDDDDD");
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: productDetails.map(({ Name, Price, Quantity }) => ({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: Name,
            },
            unit_amount: Math.round(Price * 100),
          },
          quantity: Quantity,
        })),
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/products-tourist`,
        cancel_url: `${process.env.CLIENT_URL}/products-tourist`,
        metadata: {
          UserId: req._id,
          Products: JSON.stringify(productDetails),
          totalPrice,
          currency,
        },
      });

      //console.log("HEREHRHERHER");
      //STRIPE POSTS successful / cancelled ORDERS TO BOOKINGS

      //await booking.save();

      return res.status(200).json({
        msg: "Proceed to payment via credit card",
        url: session.url,
        //booking,
      });
    }

    if (paymentMethod === "cash-on-delivery") {
      // for (const { ProductId, Quantity } of products) {
      //   //console.log(ProductId);
      //   const product = await ProductModel.findById(ProductId);
      //   product.AvailableQuantity -= Quantity;
      //   await product.save();
      // }

      const booking = new ProductBooking({
        UserId: touristId,
        Status: "Pending",
        TotalPaid: totalPrice,
        Currency: currency,
        Products: productDetails,
        PaymentMethod: paymentMethod,
      });

      await booking.save();

      return res
        .status(200)
        .json({ message: "Booking created for cash-on-delivery", booking });
    }

    return res.status(400).json({ message: "Invalid payment method" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createFlightBooking = async (req, res) => {
  const { id } = req.params;
  const { currency, NumberSeats } = req.body;

  try {
    const flight = await FlightModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    const totalPrice =
      Number(convertPrice(flight.price.total, currency)) * NumberSeats;
    const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    const walletDeduction = Math.min(walletBalance, totalPrice);
    const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: flight.type,
            },
            unit_amount: Math.round((remainingPrice * 100) / NumberSeats),
          },
          quantity: NumberSeats,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/flights/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/flights/${id}`,
      metadata: {
        FlightId: id,
        UserId: req._id,
        NumberSeats,
        currency,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getMyFlightBookings = async (req, res) => {
  try {
    const bookings = await FlightBooking.find({
      UserId: req._id,
      Status: "Confirmed",
    }).populate("FlightId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const createHotelBooking = async (req, res) => {
  const { id } = req.params;
  const { currency, OfferId } = req.body;

  try {
    const hotel = await HotelModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    const totalPrice =
      Number(
        convertPrice(
          hotel.offers.find((offer) => offer.id === OfferId).price.total,
          currency
        )
      ) * 1;
    const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    const walletDeduction = Math.min(walletBalance, totalPrice);
    const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: hotel.name,
            },
            unit_amount: Math.round((remainingPrice * 100) / 1),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/hotels/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/hotels/${id}`,
      metadata: {
        HotelId: id,
        UserId: req._id,
        OfferId,
        currency,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getMyHotelBookings = async (req, res) => {
  try {
    const bookings = await HotelBooking.find({
      UserId: req._id,
      Status: "Confirmed",
    }).populate("HotelId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const createTransportationBooking = async (req, res) => {
  const { id } = req.params;
  const { currency, startDate, endDate, pickupLocation, dropoffLocation } =
    req.body;

  try {
    const transportation = await Transportation.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    const numberOfDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = Number(
      convertPrice(transportation.pricePerDay * numberOfDays, currency)
    );
    const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    const walletDeduction = Math.min(walletBalance, totalPrice);
    const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `${transportation.name} - ${transportation.type}`,
            },
            unit_amount: Math.round(remainingPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/transportations/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/transportations/${id}`,
      metadata: {
        TransportationId: id,
        UserId: req._id,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        currency,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getMyTransportationBookings = async (req, res) => {
  try {
    const bookings = await TransportationBooking.find({
      UserId: req._id,
      Status: "Confirmed",
    }).populate("TransportationId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

module.exports = {
  createItineraryBooking,
  acceptBooking,
  getMyItineraryBookings,
  getSingleItineraryBooking,
  createActivityBooking,
  getMyActivityBookings,
  getSingleActivityBooking,
  cancelActivityBooking,
  cancelItineraryBooking,
  createProductBooking,
  getMyProductBookings,
  createFlightBooking,
  getMyFlightBookings,
  createHotelBooking,
  getMyHotelBookings,
  createTransportationBooking,
  getMyTransportationBookings,
  createProductBookingCart,
  deleteAllProductBookings,
  getMyCurrentProductBookings,
  cancelOrderProductBooking,
  updateQuantityProductAndStatus,
  getallItineraryBookings,
  getallActivityBookings,
  getItineraryBookingsById,
  getActivityBookingsById,
};
