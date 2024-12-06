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
const NotificationService = require("../config/notification.service");
const notificationService = new NotificationService();
const PromoCode = require("../models/PromoCode.js");

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

const calculatePriceAfterPromo = async (originalPrice, promoCode, userId) => {
  if (!promoCode) return originalPrice;

  const promoCodeDoc = await PromoCode.findOne({
    Code: promoCode.toUpperCase(),
  });

  if (!promoCodeDoc) {
    throw new Error("Invalid promo code");
  }

  if (
    !promoCodeDoc.ApplicableToAll &&
    !promoCodeDoc.EligibleUsers.includes(userId)
  ) {
    throw new Error("You are not eligible to use this promo code");
  }

  if (promoCodeDoc.Type === "percentage") {
    return originalPrice * (1 - promoCodeDoc.Value / 100);
  } else {
    return Math.max(0, originalPrice - promoCodeDoc.Value);
  }
};

const getPromoCodeId = async (code) => {
  if (!code) return null;
  const promoCode = await PromoCode.findOne({ Code: code.toUpperCase() });
  return promoCode?._id || null;
};

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

const getAllActivityBookings = async (req, res) => {
  try {
    const bookings = await ActivityBooking.find({
      Status: "Confirmed",
    }).populate("ActivityId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getItineraryBookingsById = async (req, res) => {
  const { id } = req.params;
  try {
    const bookings = await ItineraryBooking.find({
      ItineraryId: id,
      Status: "Confirmed",
    });
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ Participants: 0 });
    }
    const Participants = bookings.reduce(
      (sum, booking) => sum + (booking.Participants || 0),
      0
    );
    res.status(200).json({
      Participants,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
const getItineraryBookingsByIdAndDate = async (req, res) => {
  const { id, createdAt } = req.params; // Itinerary ID and createdAt date in params

  try {
    // Parse the createdAt date from params
    const createdAtDate = new Date(createdAt);

    // Validate the createdAt date
    if (isNaN(createdAtDate.getTime())) {
      return res
        .status(400)
        .json({ msg: "Invalid date format in createdAt parameter" });
    }

    // Log the parsed createdAt date for debugging
    console.log("Parsed createdAt date: ", createdAtDate);

    // Define the start and end of the day for the given date
    const startOfDay = new Date(
      Date.UTC(
        createdAtDate.getUTCFullYear(),
        createdAtDate.getUTCMonth(),
        createdAtDate.getUTCDate(),
        0,
        0,
        0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        createdAtDate.getUTCFullYear(),
        createdAtDate.getUTCMonth(),
        createdAtDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    // Log the start and end of the day for debugging
    console.log("Start of day: ", startOfDay);
    console.log("End of day: ", endOfDay);

    // Query for bookings with the specified ID, status, and date range
    const bookings = await ItineraryBooking.find({
      ItineraryId: id,
      Status: "Confirmed",
      createdAt: { $gte: startOfDay, $lt: endOfDay }, // Filter for the entire day
    }).populate("ItineraryId"); // Optional: Populate the ItineraryId if needed

    // If no bookings found, return 0 participants
    bookings.forEach((booking) => {
      console.log("Booking Created At: ", booking.createdAt); // Print the createdAt field of each booking
    });
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ Participants: 0 });
    }

    // Calculate total participants
    const Participants = bookings.reduce(
      (sum, booking) => sum + (booking.Participants || 0),
      0
    );

    // Return the total participants
    res.status(200).json({
      Participants,
    });
  } catch (err) {
    // Log error for debugging
    console.error("Error fetching bookings:", err.message);

    // Handle server errors
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getActivityBookingsById = async (req, res) => {
  const { id } = req.params;
  try {
    const bookings = await ActivityBooking.find({
      ActivityId: id,
      Status: "Confirmed",
    });
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ Participants: 0 });
    }
    const Participants = bookings.reduce(
      (sum, booking) => sum + (booking.Participants || 0),
      0
    );
    res.status(200).json({
      Participants,
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
  const { currency, Participants, promoCode } = req.body;

  try {
    const itinerary = await ItineraryModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    let totalPrice =
      Number(convertPrice(itinerary.Price, currency)) * Participants;
    // const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    // const walletDeduction = Math.min(walletBalance, totalPrice);
    // const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    if (promoCode) {
      totalPrice = await calculatePriceAfterPromo(
        totalPrice,
        promoCode,
        req._id
      );
    }

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
            unit_amount: Math.round((totalPrice * 100) / Participants),
          },
          quantity: Participants,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/itinerary/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/itinerary/${id}`,
      metadata: {
        ItineraryId: id,
        UserId: req._id,
        Participants,
        ItineraryStartDate: itinerary.StartDate.toDateString(),
        ItineraryEndDate: itinerary.EndDate.toDateString(),
        currency,
        promoCode,
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

    const bookingPrice = booking.TotalPaid;
    const bookingCurrency = booking.Currency;

    const tourist = await TouristModel.findOne(
      { UserId: booking.UserId },
      "Wallet"
    );

    const addedBalance = convertPrice(
      (bookingPrice || 0) / 100,
      bookingCurrency
    );
    const newWalletBalance = parseFloat(tourist.Wallet) + addedBalance;

    tourist.Wallet = newWalletBalance.toFixed(2);
    await tourist.save();

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
  const { currency, Participants, promoCode } = req.body;

  try {
    const activity = await ActivityModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    console.log(activity);

    let totalPrice =
      Number(
        convertPrice(
          activity.Price * ((100 - activity.SpecialDiscounts) / 100),
          currency
        )
      ) * Participants;

    if (promoCode) {
      totalPrice = await calculatePriceAfterPromo(
        totalPrice,
        promoCode,
        req._id
      );
    }
    // const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    // const walletDeduction = Math.min(walletBalance, totalPrice);
    // const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: activity.Name,
            },
            unit_amount: Math.round((totalPrice * 100) / Participants),
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
        promoCode,
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
    const bookingPrice = booking.TotalPaid;
    const bookingCurrency = booking.Currency;

    const tourist = await TouristModel.findOne(
      { UserId: booking.UserId },
      "Wallet"
    );

    const addedBalance = convertPrice(
      (bookingPrice || 0) / 100,
      bookingCurrency
    );
    const newWalletBalance = parseFloat(tourist.Wallet) + addedBalance;

    tourist.Wallet = newWalletBalance.toFixed(2);
    await tourist.save();

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
          AvailableQuantity:
            product.ProductId.AvailableQuantity /* - quantity */,
          TotalSales: product.ProductId.TotalSales /* + quantity */,
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

    console.log(bookings);

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

      const tourist = await TouristModel.findOne({
        UserId: metadata.UserId,
      }).populate("UserId");

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

      const promoCodeId = await getPromoCodeId(metadata.promoCode);

      await ItineraryBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        ItineraryId: metadata.ItineraryId,
        Participants: metadata.Participants,
        ItineraryStartDate: new Date(metadata.ItineraryStartDate),
        ItineraryEndDate: new Date(metadata.ItineraryEndDate),
        Currency: session.currency.toUpperCase(),
        PromoCode: promoCodeId,
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

      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Itinerary Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your booking for the itinerary '" +
          itinerary.Name +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          session.amount_total / 100 +
          " " +
          session.currency.toUpperCase() +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.ActivityId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({
        UserId: metadata.UserId,
      }).populate("UserId");
      const activity = await ActivityModel.findById(metadata.ActivityId);

      const promoCodeId = await getPromoCodeId(metadata.promoCode);

      await ActivityBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        ActivityId: metadata.ActivityId,
        Participants: metadata.Participants,
        ActivityDate: new Date(metadata.ActivityDate),
        Currency: session.currency.toUpperCase(),
        PromoCode: promoCodeId,
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

      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Activity Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your booking for the activity '" +
          activity.Name +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          session.amount_total / 100 +
          " " +
          session.currency.toUpperCase() +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.ProductId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({
        UserId: metadata.UserId,
      }).populate("UserId");
      const product = await ProductModel.findById(metadata.ProductId);

      const promoCodeId = await getPromoCodeId(metadata.promoCode);

      await ProductBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        Products: [
          { ProductId: metadata.ProductId, Quantity: metadata.Quantity },
        ],
        PaymentMethod: "credit-card",
        Currency: session.currency.toUpperCase(),
        PromoCode: promoCodeId,
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

      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Product Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your order for the product '" +
          product.Name +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          session.amount_total / 100 +
          " " +
          session.currency.toUpperCase() +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.FlightId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({
        UserId: metadata.UserId,
      }).populate("UserId");
      const flight = await FlightModel.findById(metadata.FlightId);

      const promoCodeId = await getPromoCodeId(metadata.promoCode);

      await FlightBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        FlightId: metadata.FlightId,
        NumberSeats: metadata.NumberSeats,
        Currency: session.currency.toUpperCase(),
        PromoCode: promoCodeId,
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

      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Flight Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your booking for the flight from '" +
          flight.origin +
          "' to '" +
          flight.destination +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          session.amount_total / 100 +
          " " +
          session.currency.toUpperCase() +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.HotelId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({
        UserId: metadata.UserId,
      }).populate("UserId");
      const hotel = await HotelModel.findById(metadata.HotelId);

      const promoCodeId = await getPromoCodeId(metadata.promoCode);

      await HotelBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        HotelId: metadata.HotelId,
        OfferId: metadata.OfferId,
        Currency: session.currency.toUpperCase(),
        PromoCode: promoCodeId,
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

      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Hotel Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your booking for the hotel '" +
          hotel.name +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          session.amount_total / 100 +
          " " +
          session.currency.toUpperCase() +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.TransportationId) {
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({
        UserId: metadata.UserId,
      }).populate("UserId");
      const transportation = await Transportation.findById(
        metadata.TransportationId
      );

      const promoCodeId = await getPromoCodeId(metadata.promoCode);

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
        PromoCode: promoCodeId,
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

      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Transportation Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your booking for the transportation of type '" +
          transportation.type +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          session.amount_total / 100 +
          " " +
          session.currency.toUpperCase() +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
      });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return res.status(200).json({ msg: "Booking confirmed" });
    } else if (metadata.Products) {
      const products = JSON.parse(metadata.Products);
      const sessionDB = await mongoose.startSession();
      sessionDB.startTransaction();

      const tourist = await TouristModel.findOne({
        UserId: metadata.UserId,
      }).populate("UserId");
      const productsData = await Promise.all(
        products.map(async (product) => {
          const productData = await ProductModel.findById(product.ProductId);
          return productData;
        })
      );

      const promoCodeId = await getPromoCodeId(metadata.promoCode);

      console.log("Products:", products);

      await ProductBooking.create({
        UserId: metadata.UserId,
        Status: "Confirmed",
        TotalPaid: session.amount_total,
        Products: products.map((product) => ({
          ProductId: product.ProductId,
          Quantity: product.Quantity,
        })),
        Currency: session.currency.toUpperCase(),
        PaymentMethod: "credit-card",
        PromoCode: promoCodeId,
      });

      await Promise.all(
        products.map(async (product) => {
          await ProductModel.findByIdAndUpdate(
            product.ProductId,
            [
              {
                $set: {
                  AvailableQuantity: {
                    $cond: {
                      if: {
                        $gte: [
                          "$AvailableQuantity",
                          parseInt(product.Quantity),
                        ],
                      },
                      then: {
                        $subtract: [
                          "$AvailableQuantity",
                          parseInt(product.Quantity),
                        ],
                      },
                      else: "$AvailableQuantity",
                    },
                  },
                  TotalSales: {
                    $add: [
                      { $ifNull: ["$TotalSales", 0] },
                      parseInt(product.Quantity),
                    ],
                  },
                },
              },
            ],
            { new: true }
          );
        })
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
          Cart: [],
        },
      });

      const listOfProducts = productsData.map((product) => product.Name);

      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Product Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your order for the products '" +
          listOfProducts.join(", ") +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          session.amount_total / 100 +
          " " +
          session.currency.toUpperCase() +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
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
  const { currency, Quantity, promoCode } = req.body;

  try {
    const product = await ProductModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    let totalPrice = Number(convertPrice(product.Price, currency)) * Quantity;
    // const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    // const walletDeduction = Math.min(walletBalance, totalPrice);
    // const remainingPrice = Math.max(totalPrice - walletDeduction, 0);
    if (promoCode) {
      totalPrice = await calculatePriceAfterPromo(
        totalPrice,
        promoCode,
        req._id
      );
    }

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
            unit_amount: Math.round((totalPrice * 100) / Quantity),
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
        promoCode,
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
    const tourist = await TouristModel.findOne({ UserId: touristId }, "Wallet");

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

    if (order.Status === "Confirmed" || order.Status === "Pending") {
      //raga3 el feloos fel wallet, zawed el products' availablequantity we raga3 el totalsales
      for (const product of order.Products) {
        //console.log(`product: ${JSON.stringify(product)}`);
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
      //console.log(`tourist.Wallet: ${tourist.Wallet}`);
      //console.log(`order.TotalPaid: ${order.TotalPaid}`);
      if (order.Status === "Confirmed")
        tourist.Wallet = parseFloat(tourist.Wallet) + order.TotalPaid / 100;
      await tourist.save();
    }

    const updatedBooking = await ProductBooking.findByIdAndUpdate(
      orderId,
      {
        Status: "Cancelled",
      },
      { new: true }
    );
    //console.log(`tourist.Wallet: ${tourist.Wallet}`);
    //console.log(`order.TotalPaid: ${order.TotalPaid}`);
    tourist.Wallet = parseFloat(tourist.Wallet) + order.TotalPaid / 100;
    await tourist.save();

    res.status(200).json({
      message: `Order ${orderId} cancelled successfully`,
      booking: updatedBooking,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createProductBookingCart = async (req, res) => {
  const { touristId, products, currency, paymentMethod, promoCode } = req.body;

  try {
    //console.log("hereeeeeeeeeeeeeeeeee");
    //console.log(products);
    const tourist = await TouristModel.findOne(
      { _id: touristId },
      "Wallet UserId"
    ).populate("UserId");

    //console.log(tourist);
    //console.log("stops here 0");

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

    const totalBeforeDiscount = totalPrice

    if (promoCode) {
      totalPrice = await calculatePriceAfterPromo(
        totalPrice,
        promoCode,
        tourist.UserId._id.toString()
      );
    }

    console.log("Total Price: ", totalPrice);

    //console.log("stops here test 1");

    if (paymentMethod === "wallet") {
      const walletBalance = convertPrice(
        parseFloat(tourist.Wallet) || 0,
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

      tourist.Wallet = parseFloat(tourist.Wallet) - totalPrice;
      if (tourist.Wallet < 0) tourist.Wallet = 0;

      for (const { ProductId, Quantity } of products) {
        await ProductModel.findByIdAndUpdate(
          ProductId,
          {
            $inc: {
              AvailableQuantity: -Quantity,
              TotalSales: Quantity,
            },
          },
          { new: true }
        );
      }

      const booking = new ProductBooking({
        UserId: req._id,
        Status: "Confirmed",
        TotalPaid: totalPrice * 100,
        Currency: currency,
        Products: productDetails,
        PaymentMethod: paymentMethod,
      });

      await booking.save();

      tourist.Cart = [];
      await tourist.save();

      const productNames = productDetails.map((product) => product.Name);
      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Product Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your order for the products '" +
          productNames.join(", ") +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          totalPrice +
          " " +
          currency +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
      });

      return res
        .status(200)
        .json({ message: "Payment successful via wallet", booking });
    }

    if (paymentMethod === "credit-card") {
      //console.log("inside CARDDDDDDDDDDDDDDDDDDDDD");
      const discountedPrice = totalBeforeDiscount - totalPrice;
      const discountPerItem = discountedPrice / productDetails?.reduce((acc, { Quantity }) => acc + Quantity, 0);
      console.log("Discount per item: ", discountPerItem);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: productDetails.map(({ Name, Price, Quantity }) => ({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: Name,
            },
            unit_amount: Math.round((Price - discountPerItem) * 100),
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
      for (const { ProductId, Quantity } of products) {
        await ProductModel.findByIdAndUpdate(
          ProductId,
          {
            $inc: {
              AvailableQuantity: -Quantity,
              TotalSales: Quantity,
            },
          },
          { new: true }
        );
      }

      const booking = new ProductBooking({
        UserId: req._id,
        Status: "Pending",
        TotalPaid: totalPrice * 100,
        Currency: currency,
        Products: productDetails,
        PaymentMethod: paymentMethod,
      });

      await booking.save();

      const productNames = productDetails.map((product) => product.Name);
      //console.log(productNames);
      await notificationService.sendEmail({
        recipientEmail: tourist.UserId.Email,
        subject: "Tripify: New Product Booking Confirmed",
        content:
          "Hello " +
          tourist.UserId.UserName +
          ",<br />Your order for the products '" +
          productNames.join(", ") +
          "' has been confirmed.<br />Enjoy your trip!<br /><br /><strong>Total Paid: </strong>" +
          totalPrice +
          " " +
          currency +
          "<br /><br /><br />Thank you for choosing Tripify!<br />Tripify Team",
      });

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
  const { currency, NumberSeats, promoCode } = req.body;

  try {
    const flight = await FlightModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    let totalPrice =
      Number(convertPrice(flight.price.total, currency)) * NumberSeats;
    // const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    // const walletDeduction = Math.min(walletBalance, totalPrice);
    // const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

    if (promoCode) {
      totalPrice = await calculatePriceAfterPromo(
        totalPrice,
        promoCode,
        req._id
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: flight.type,
            },
            unit_amount: Math.round((totalPrice * 100) / NumberSeats),
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
        promoCode,
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
  const { currency, OfferId, promoCode } = req.body;

  try {
    const hotel = await HotelModel.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    let totalPrice =
      Number(
        convertPrice(
          hotel.offers.find((offer) => offer.id === OfferId).price.total,
          currency
        )
      ) * 1;
    // const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    // const walletDeduction = Math.min(walletBalance, totalPrice);
    // const remainingPrice = Math.max(totalPrice - walletDeduction, 0);
    if (promoCode) {
      totalPrice = await calculatePriceAfterPromo(
        totalPrice,
        promoCode,
        req._id
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: hotel.name,
            },
            unit_amount: Math.round((totalPrice * 100) / 1),
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
        promoCode,
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
  const {
    currency,
    startDate,
    endDate,
    pickupLocation,
    dropoffLocation,
    promoCode,
  } = req.body;

  try {
    const transportation = await Transportation.findById(id);
    const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

    const numberOfDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    let totalPrice = Number(
      convertPrice(transportation.pricePerDay * numberOfDays, currency)
    );
    // const walletBalance = convertPrice(Number(tourist.Wallet) || 0, currency);
    // const walletDeduction = Math.min(walletBalance, totalPrice);
    // const remainingPrice = Math.max(totalPrice - walletDeduction, 0);
    if (promoCode) {
      totalPrice = await calculatePriceAfterPromo(
        totalPrice,
        promoCode,
        req._id
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `${transportation.name} - ${transportation.type}`,
            },
            unit_amount: Math.round(totalPrice * 100),
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
        promoCode,
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

const allItinerariesBookedForTourguide = async (req, res) => {
  const { id } = req.params;
  try {
    const allItineraryBookings = await ItineraryBooking.find().populate(
      "ItineraryId"
    );
    if (!allItineraryBookings.length)
      return res.status(404).json({ message: "No itineraries found" });

    const allItineraryBookingsForTourguide = allItineraryBookings.filter(
      (itinerary) => (itinerary?.ItineraryId?.TourGuide).toString() === id
    );
    if (!allItineraryBookingsForTourguide.length)
      return res
        .status(404)
        .json({ message: `No itineraries found for tourguide ${id}` });

    res.status(200).json({
      allItineraryBookingsTourguide: allItineraryBookingsForTourguide,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const allActivitiesBookedForAdvertiser = async (req, res) => {
  const { id } = req.params;
  try {
    const allActivityBookings = await ActivityBooking.find({
      Status: "Confirmed",
    }).populate("ActivityId");
    if (!allActivityBookings.length)
      return res.status(404).json({ message: "No activities found" });

    const allActivityBookingsForAdvertiser = allActivityBookings.filter(
      (activity) => (activity?.ActivityId?.AdvertiserId).toString() === id
    );
    if (!allActivityBookingsForAdvertiser.length)
      return res
        .status(404)
        .json({ message: `No activities found for advertiser ${id}` });

    const uniqueIds = new Set();
    let totalParticipants = 0;
    allActivityBookingsForAdvertiser.forEach((activity) => {
      const activityId = activity?.ActivityId?._id;
      if (activityId && !uniqueIds.has(activityId)) {
        uniqueIds.add(activityId);
      }
      //console.log(`uniqueIds: ${JSON.stringify(uniqueIds)}`);
      totalParticipants += parseInt(activity.Participants);
    });

    res.status(200).json({
      totalParticipants,
      uniqueIds: Array.from(uniqueIds),
      allActivityBookingsForAdvertiser,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const allBoughtProductsForThisSeller = async (req, res) => {
  const { id } = req.params;
  try {
    const allProductBookings = await ProductBooking.find().populate(
      "Products.ProductId"
    );
    if (!allProductBookings.length)
      return res.status(404).json({ message: "No products bought" });

    //return res.status(200).json({ allProductBookings: allProductBookings });

    const productsBoughtFromThisSeller = allProductBookings
      .map((product) =>
        product?.Products.filter(
          (product) => (product?.ProductId?.Seller).toString() === id
        )
      )
      .filter((filteredArray) => filteredArray.length > 0);

    let totalNumberOfProductsSold = 0;
    productsBoughtFromThisSeller.map((order) =>
      order.map(
        (product) => (totalNumberOfProductsSold += parseInt(product?.Quantity))
      )
    );

    if (!productsBoughtFromThisSeller.length)
      return res
        .status(404)
        .json({ message: `No products of seller ${id} were bought` });

    res.status(200).json({
      numberOfProductsBought: totalNumberOfProductsSold,
      productsBoughtFromThisSeller: productsBoughtFromThisSeller,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
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
  getItineraryBookingsByIdAndDate,
  allItinerariesBookedForTourguide,
  allBoughtProductsForThisSeller,
  getAllActivityBookings,
  allActivitiesBookedForAdvertiser,
};
