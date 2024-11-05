const { ItineraryBooking, ActivityBooking, ProductBooking, FlightBooking, HotelBooking } = require("../models/Booking.js");
const ItineraryModel = require("../models/Itinerary.js");
const TouristModel = require("../models/Tourist.js");
const ActivityModel = require("../models/Activity.js");
const ProductModel = require("../models/Product.js");
const FlightModel = require("../models/Flight.js");
const HotelModel = require("../models/Hotel.js");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const { convertPrice, convertToUSD } = require("../config/currencyHelpers.js");

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
    try 
    {
        const bookings = await ItineraryBooking.find({ UserId: req._id, Status: "Confirmed" }).populate('ItineraryId');
        res.status(200).json(bookings);
    }
    catch (e) 
    {
        res.status(400).json({ msg: e.message });
    }
}

const getSingleItineraryBooking = async (req, res) => {
    const { id } = req.params;
    console.log(id)

    try 
    {
        const booking = await ItineraryBooking.findById(id).populate({
            path: 'ItineraryId',
            populate: [
                {
                    path: 'Reviews',
                    populate: {
                        path: 'UserId',
                    }
                },
                {
                    path: 'TourGuide',
                    populate: [
                        {
                            path: 'UserId',
                        },
                        {
                            path: 'Reviews',
                            populate: {
                                path: 'UserId',
                            }
                        }
                    ]
                }
            ]
        })

        console.log(booking)

        if(booking.UserId.toString() !== req._id.toString()) {
            return res.status(400).json({ msg: 'Unauthorized' });
        }

        res.status(200).json(booking);
    }
    catch(e) 
    {
        res.status(400).json({ msg: e.message });
    }
}

const createItineraryBooking = async (req, res) => {
    const { id } = req.params;
    const { currency, Participants } = req.body;

    try {
        const itinerary = await ItineraryModel.findById(id)
        const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

        const totalPrice = Number(convertPrice(itinerary.Price, currency)) * Participants;
        const walletBalance = convertPrice((Number(tourist.Wallet) || 0), currency)
        const walletDeduction = Math.min(walletBalance, totalPrice);
        const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

        if(itinerary.RemainingBookings < Participants) {
            return res.status(400).json({ msg: 'Not enough spots left' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: itinerary.Name,
                        },
                        unit_amount: Math.round(remainingPrice * 100 / Participants),
                    },
                    quantity: Participants,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/itineraries/${id}`,
            cancel_url: `${process.env.CLIENT_URL}/itineraries/${id}`,
            metadata: {
                ItineraryId: id,
                UserId: req._id,
                Participants,
                ItineraryStartDate: itinerary.StartDate.toDateString(),
                ItineraryEndDate: itinerary.EndDate.toDateString(),
                currency
            }
        })

        res.status(200).json({ url: session.url });
    }
    catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

const cancelItineraryBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await ItineraryBooking.findById(id);

        if(booking.UserId.toString() !== req._id.toString()) {
            return res.status(400).json({ msg: 'Unauthorized' });
        }

        if(booking.Status !== 'Confirmed') {
            return res.status(400).json({ msg: 'Booking not confirmed yet' });
        }

        await ItineraryBooking.findByIdAndUpdate(id, { Status: 'Cancelled' });

        await ItineraryModel.findByIdAndUpdate(booking.ItineraryId, {
            $inc: { RemainingBookings: booking.Participants }
        });

        res.status(200).json({ msg: 'Booking cancelled' });
    }
    catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

const createActivityBooking = async (req, res) => {
    const { id } = req.params;
    const { currency, Participants } = req.body;

    try {
        const activity = await ActivityModel.findById(id)
        const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

        console.log(activity)

        const totalPrice = Number(convertPrice(activity.Price * ((100 - activity.SpecialDiscounts) / 100), currency)) * Participants;
        const walletBalance = convertPrice((Number(tourist.Wallet) || 0), currency)
        const walletDeduction = Math.min(walletBalance, totalPrice);
        const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                        name: activity.Name,
                    },
                    unit_amount: Math.round(remainingPrice * 100 / Participants),
                },
                quantity: Participants,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/activities/${id}`,
            cancel_url: `${process.env.CLIENT_URL}/activities/${id}`,
            metadata: {
                ActivityId: id,
                UserId: req._id,
                Participants,
                ActivityDate: activity.Date.toDateString(),
                currency
            }
        })

        res.status(200).json({ url: session.url });
    }
    catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

const cancelActivityBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await ActivityBooking.findById(id);

        if(booking.UserId.toString() !== req._id.toString()) {
            return res.status(400).json({ msg: 'Unauthorized' });
        }

        if(booking.Status !== 'Confirmed') {
            return res.status(400).json({ msg: 'Booking not confirmed yet' });
        }

        await ActivityBooking.findByIdAndUpdate(id, { Status: 'Cancelled' });

        res.status(200).json({ msg: 'Booking cancelled' });
    }
    catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

const getMyActivityBookings = async (req, res) => {
    try 
    {
        const bookings = await ActivityBooking.find({ UserId: req._id, Status: "Confirmed" }).populate('ActivityId');
        res.status(200).json(bookings);
    }
    catch (e) 
    {
        res.status(400).json({ msg: e.message });
    }
}

const getMyProductBookings = async (req, res) => {
    try 
    {
        const bookings = await ProductBooking.find({ UserId: req._id, Status: "Confirmed" }).populate({
            path: 'ProductId',
            populate: {
                path: 'Reviews',
                populate: {
                    path: 'UserId',
                }
            }
        });
        res.status(200).json(bookings);
    }
    catch (e) 
    {
        res.status(400).json({ msg: e.message });
    }
}

const getSingleActivityBooking = async (req, res) => {
    const { id } = req.params;

    try 
    {
        const booking = await ActivityBooking.findById(id).populate({
            path: 'ActivityId',
            populate: [
                {
                    path: 'Reviews',
                    populate: {
                        path: 'UserId',
                    }
                },
                {
                    path: 'AdvertiserId',
                    populate: [
                        {
                            path: 'UserId',
                        },
                        {
                            path: 'Reviews',
                            populate: {
                                path: 'UserId',
                            }
                        }
                    ]
                }
            ]
        })

        if(booking.UserId.toString() !== req._id.toString()) {
            return res.status(400).json({ msg: 'Unauthorized' });
        }

        res.status(200).json(booking);

    }
    catch(e) 
    {
        res.status(400).json({ msg: e.message });
    }

}
  
const acceptBooking = async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;
        
    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SECRET);
    } catch (err) {
        // console.error('Webhook Error:', err.message);
        // return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(event);

    if(req.body.type === 'checkout.session.completed') {
        const session = payload.data.object;
        const metadata = session.metadata;
        
        if(metadata.ItineraryId) {
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
                                    if: { $gte: ["$RemainingBookings", parseInt(metadata.Participants)] },
                                    then: { $subtract: ["$RemainingBookings", parseInt(metadata.Participants)] },
                                    else: "$RemainingBookings"
                                }
                            }
                        }
                    }
                ], 
                { new: true }
            )

            await ItineraryBooking.create({
                UserId: metadata.UserId,
                Status: 'Confirmed',
                TotalPaid: session.amount_total,
                ItineraryId: metadata.ItineraryId,
                Participants: metadata.Participants,
                ItineraryStartDate: new Date(metadata.ItineraryStartDate),
                ItineraryEndDate: new Date(metadata.ItineraryEndDate),
                Currency: session.currency.toUpperCase()
            })

            const totalPaidInUSD = convertToUSD(session.amount_total / 100, session.currency.toUpperCase());

            const totalLoyaltyPointsEarned = totalPaidInUSD * ( tourist.Badge === 'Gold' ? 1.5 : tourist.Badge === 'Silver' ? 1 : 0.5 );
            const newTotalLoayltyPoints = tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
            const newLoayltyPointsEarned = tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
            const newBadge = newTotalLoayltyPoints >= 500000 ? 'Gold' : newTotalLoayltyPoints >= 100000 ? 'Silver' : 'Bronze';

            await TouristModel.findByIdAndUpdate(tourist._id, {
                $set: {
                    LoyaltyPoints: newLoayltyPointsEarned,
                    TotalLoyaltyPoints: newTotalLoayltyPoints,
                    Badge: newBadge,
                    Wallet: "0.00"
                }
            })

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

            console.log(itinerary, metadata)

            await sessionDB.commitTransaction();
            sessionDB.endSession();

            return res.status(200).json({ msg: 'Booking confirmed' });
        }
        else if(metadata.ActivityId) {
            const sessionDB = await mongoose.startSession();
            sessionDB.startTransaction();

            const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

            await ActivityBooking.create({
                UserId: metadata.UserId,
                Status: 'Confirmed',
                TotalPaid: session.amount_total,
                ActivityId: metadata.ActivityId,
                Participants: metadata.Participants,
                ActivityDate: new Date(metadata.ActivityDate),
                Currency: session.currency.toUpperCase()
            })

            const totalPaidInUSD = convertToUSD(session.amount_total / 100, session.currency.toUpperCase());

            const totalLoyaltyPointsEarned = totalPaidInUSD * ( tourist.Badge === 'Gold' ? 1.5 : tourist.Badge === 'Silver' ? 1 : 0.5 );
            const newTotalLoayltyPoints = tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
            const newLoayltyPointsEarned = tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
            const newBadge = newTotalLoayltyPoints >= 500000 ? 'Gold' : newTotalLoayltyPoints >= 100000 ? 'Silver' : 'Bronze';

            await TouristModel.findByIdAndUpdate(tourist._id, {
                $set: {
                    LoyaltyPoints: newLoayltyPointsEarned,
                    TotalLoyaltyPoints: newTotalLoayltyPoints,
                    Badge: newBadge,
                    Wallet: "0.00"
                }
            })

            await sessionDB.commitTransaction();
            sessionDB.endSession();

            return res.status(200).json({ msg: 'Booking confirmed' });
        }
        else if(metadata.ProductId) {
            const sessionDB = await mongoose.startSession();
            sessionDB.startTransaction();

            const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

            await ProductBooking.create({
                UserId: metadata.UserId,
                Status: 'Confirmed',
                TotalPaid: session.amount_total,
                ProductId: metadata.ProductId,
                Quantity: metadata.Quantity,
                Currency: session.currency.toUpperCase()
            })

            await ProductModel.findByIdAndUpdate(metadata.ProductId, [
                {
                    $set: {
                        AvailableQuantity: {
                            $cond: {
                                if: { $gte: ["$AvailableQuantity", parseInt(metadata.Quantity)] },
                                then: { $subtract: ["$AvailableQuantity", parseInt(metadata.Quantity)] },
                                else: "$AvailableQuantity"
                            }
                        },
                        TotalSales: { $add: ["$TotalSales", parseInt(metadata.Quantity)] }
                    }
                }
            ], { new: true })

            const totalPaidInUSD = convertToUSD(session.amount_total / 100, session.currency.toUpperCase());

            const totalLoyaltyPointsEarned = totalPaidInUSD * ( tourist.Badge === 'Gold' ? 1.5 : tourist.Badge === 'Silver' ? 1 : 0.5 );
            const newTotalLoayltyPoints = tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
            const newLoayltyPointsEarned = tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
            const newBadge = newTotalLoayltyPoints >= 500000 ? 'Gold' : newTotalLoayltyPoints >= 100000 ? 'Silver' : 'Bronze';

            await TouristModel.findByIdAndUpdate(tourist._id, {
                $set: {
                    LoyaltyPoints: newLoayltyPointsEarned,
                    TotalLoyaltyPoints: newTotalLoayltyPoints,
                    Badge: newBadge,
                    Wallet: "0.00"
                }
            })

            await sessionDB.commitTransaction();
            sessionDB.endSession();

            return res.status(200).json({ msg: 'Booking confirmed' });
        }
        else if(metadata.FlightId) {
            const sessionDB = await mongoose.startSession();
            sessionDB.startTransaction();

            const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

            await FlightBooking.create({
                UserId: metadata.UserId,
                Status: 'Confirmed',
                TotalPaid: session.amount_total,
                FlightId: metadata.FlightId,
                NumberSeats: metadata.NumberSeats,
                Currency: session.currency.toUpperCase()
            })

            const totalPaidInUSD = convertToUSD(session.amount_total / 100, session.currency.toUpperCase());

            const totalLoyaltyPointsEarned = totalPaidInUSD * ( tourist.Badge === 'Gold' ? 1.5 : tourist.Badge === 'Silver' ? 1 : 0.5 );
            const newTotalLoayltyPoints = tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
            const newLoayltyPointsEarned = tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
            const newBadge = newTotalLoayltyPoints >= 500000 ? 'Gold' : newTotalLoayltyPoints >= 100000 ? 'Silver' : 'Bronze';

            await TouristModel.findByIdAndUpdate(tourist._id, {
                $set: {
                    LoyaltyPoints: newLoayltyPointsEarned,
                    TotalLoyaltyPoints: newTotalLoayltyPoints,
                    Badge: newBadge,
                    Wallet: "0.00"
                }
            })

            await sessionDB.commitTransaction();
            sessionDB.endSession();

            return res.status(200).json({ msg: 'Booking confirmed' });
        }
        else if(metadata.HotelId) {
            const sessionDB = await mongoose.startSession();
            sessionDB.startTransaction();

            const tourist = await TouristModel.findOne({ UserId: metadata.UserId });

            await HotelBooking.create({
                UserId: metadata.UserId,
                Status: 'Confirmed',
                TotalPaid: session.amount_total,
                HotelId: metadata.HotelId,
                OfferId: metadata.OfferId,
                Currency: session.currency.toUpperCase()
            })

            const totalPaidInUSD = convertToUSD(session.amount_total / 100, session.currency.toUpperCase());

            const totalLoyaltyPointsEarned = totalPaidInUSD * ( tourist.Badge === 'Gold' ? 1.5 : tourist.Badge === 'Silver' ? 1 : 0.5 );
            const newTotalLoayltyPoints = tourist.TotalLoyaltyPoints + totalLoyaltyPointsEarned;
            const newLoayltyPointsEarned = tourist.LoyaltyPoints + totalLoyaltyPointsEarned;
            const newBadge = newTotalLoayltyPoints >= 500000 ? 'Gold' : newTotalLoayltyPoints >= 100000 ? 'Silver' : 'Bronze';

            await TouristModel.findByIdAndUpdate(tourist._id, {
                $set: {
                    LoyaltyPoints: newLoayltyPointsEarned,
                    TotalLoyaltyPoints: newTotalLoayltyPoints,
                    Badge: newBadge,
                    Wallet: "0.00"
                }
            })

            await sessionDB.commitTransaction();
            sessionDB.endSession();

            return res.status(200).json({ msg: 'Booking confirmed' });
        }

        return res.status(400).json({ msg: 'Invalid metadata' });
    }

    return res.status(200).json({ msg: 'Event not handled' });
}

const createProductBooking = async (req, res) => {
    const { id } = req.params;
    const { currency, Quantity } = req.body;

    try {
        const product = await ProductModel.findById(id)
        const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

        const totalPrice = Number(convertPrice(product.Price, currency)) * Quantity;
        const walletBalance = convertPrice((Number(tourist.Wallet) || 0), currency)
        const walletDeduction = Math.min(walletBalance, totalPrice);
        const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

        if(product.AvailableQuantity < Quantity) {
            return res.status(400).json({ msg: 'Not enough spots left' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: product.Name,
                        },
                        unit_amount: Math.round(remainingPrice * 100 / Quantity),
                    },
                    quantity: Quantity,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/products-tourist/${id}`,
            cancel_url: `${process.env.CLIENT_URL}/products-tourist/${id}`,
            metadata: {
                ProductId: id,
                UserId: req._id,
                Quantity,
                currency
            }
        })

        res.status(200).json({ url: session.url });
    }
    catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

const createFlightBooking = async (req, res) => {
    const { id } = req.params;
    const { currency, NumberSeats } = req.body;

    try {
        const flight = await FlightModel.findById(id)
        const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

        const totalPrice = Number(convertPrice(flight.price.total, currency)) * NumberSeats;
        const walletBalance = convertPrice((Number(tourist.Wallet) || 0), currency)
        const walletDeduction = Math.min(walletBalance, totalPrice);
        const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: flight.type,
                        },
                        unit_amount: Math.round(remainingPrice * 100 / NumberSeats),
                    },
                    quantity: NumberSeats,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/flights/${id}`,
            cancel_url: `${process.env.CLIENT_URL}/flights/${id}`,
            metadata: {
                FlightId: id,
                UserId: req._id,
                NumberSeats,
                currency
            }
        })

        res.status(200).json({ url: session.url });
    }
    catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

const getMyFlightBookings = async (req, res) => {
    try 
    {
        const bookings = await FlightBooking.find({ UserId: req._id, Status: "Confirmed" }).populate('FlightId');
        res.status(200).json(bookings);
    }
    catch (e) 
    {
        res.status(400).json({ msg: e.message });
    }
}

const createHotelBooking = async (req, res) => {
    const { id } = req.params;
    const { currency, OfferId } = req.body;

    try {
        const hotel = await HotelModel.findById(id)
        const tourist = await TouristModel.findOne({ UserId: req._id }, "Wallet");

        const totalPrice = Number(convertPrice(hotel.offers.find(offer => offer.id === OfferId).price.total, currency)) * 1;
        const walletBalance = convertPrice((Number(tourist.Wallet) || 0), currency)
        const walletDeduction = Math.min(walletBalance, totalPrice);
        const remainingPrice = Math.max(totalPrice - walletDeduction, 0);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: hotel.name,
                        },
                        unit_amount: Math.round(remainingPrice * 100 / 1),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/hotels/${id}`,
            cancel_url: `${process.env.CLIENT_URL}/hotels/${id}`,
            metadata: {
                HotelId: id,
                UserId: req._id,
                OfferId,
                currency
            }
        })

        res.status(200).json({ url: session.url });
    }
    catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

const getMyHotelBookings = async (req, res) => {
    try 
    {
        const bookings = await HotelBooking.find({ UserId: req._id, Status: "Confirmed" }).populate('HotelId');
        res.status(200).json(bookings);
    }
    catch (e) 
    {
        res.status(400).json({ msg: e.message });
    }
}

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
    getMyHotelBookings
}