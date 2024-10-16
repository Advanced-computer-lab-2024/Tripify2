const { default: mongoose } = require("mongoose");
const ItineraryModel = require("../models/Itinerary.js");
const tourGuideModel = require("../models/Tourguide.js");
const TagModel = require("../models/Tag");
const CategoryModel = require("../models/Category");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createItinerary = async (req, res) => {
  //add a new itinerary to the database with
  //ctivities, Locations, Timeline, DurationOfItinerary, Language, Price, DatesAndTimes, Accesibility, Pickup, and Dropoff
  const {
    Name,
    Activities,
    Location,
    StartDate,
    TourGuide,
    EndDate,
    Language,
    Price,
    DatesAndTimes,
    Accesibility,
    Pickup,
    Dropoff,
    Category,
    Tag,
    Image,
    Rating,
  } = req.body;

  const tourGuide = await tourGuideModel.findOne({ UserId: req._id }, "UserId");
  if (!tourGuide || tourGuide?.UserId?.toString() !== TourGuide)
    return res.status(400).json({ message: "Unauthorized TourGuide!" });

  try {
    if (!Tag || Tag.length === 0) {
      return res.status(400).json({ message: "Please provide valid tags" });
    }
    if (!Category || Category.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide valid categories" });
    }
    const foundTags = await TagModel.find({ _id: { $in: Tag } });
    const foundCategories = await CategoryModel.find({
      _id: { $in: Category },
    });
    if (foundTags.length !== Tag.length) {
      return res.status(400).json({ message: "One or more Tags are invalid!" });
    }
    if (foundCategories.length !== Category.length) {
      return res
        .status(400)
        .json({ message: "One or more Categories are invalid!" });
    }
    const itinerary = await ItineraryModel.create({
      Name,
      Activities,
      Location,
      TourGuide: tourGuide,
      StartDate,
      EndDate,
      Language,
      Price,
      DatesAndTimes,
      Accesibility,
      Pickup,
      Dropoff,
      Category,
      Tag,
      Image,
      Rating,
    });
    await tourGuideModel.findOneAndUpdate(
      { UserId: req._id },
      { $push: { Itineraries: itinerary } },
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "Itinerary created Successfully\n", itinerary });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};
const getItineraries = async (req, res) => {
  try {
    console.log("Test")
    const itineraries = await ItineraryModel.find({})
      .populate("Tag")
      .populate("Category")
      .populate({
        path: 'TourGuide',
        populate: {
          path: 'UserId',
          select: 'UserName'
        }
      });

    return res.status(200).json(itineraries);
  } catch (e) {
    res.status(400).json({ msg: "Failed to find itinerary" });
  }
};

const getItinerary = async (req, res) => {
  const { id } = req.params;
  try {
    const itinerary = await ItineraryModel.findById(id)
      .populate("Tag")
      .populate("Category")
      .populate("TourGuide");
    if (!itinerary)
      return res
        .status(404)
        .json({ msg: "Cannot find any Itinerary with id ${id}" });

    return res.status(200).json(itinerary);
  } catch (e) {
    res.status(400).json({ msg: "Operation Failed" });
  }
};

const updateItinerary = async (req, res) => {
  const { id } = req.params;
  const {
    Name,
    Activities,
    Location,
    StartDate,
    TourGuide,
    EndDate,
    Language,
    Price,
    DatesAndTimes,
    Accesibility,
    Pickup,
    Dropoff,
    Category,
    Tag,
    Image,
    Rating,
  } = req.body;

  const tourGuide = await tourGuideModel.findOne(
    { UserId: TourGuide },
    "UserId"
  );

  console.log(tourGuide)

  const updatedItinerary = await ItineraryModel.findById(id);

  console.log(updatedItinerary)

  if (
    !updatedItinerary ||
    updatedItinerary.TourGuide.toString() !== tourGuide?._id.toString()
  )
    return res.status(400).json({ message: "Unauthorized TourGuide!" });

  // console.log("==============================");
  // console.log(req.body);
  // console.log("==============================");

  try {
    const itinerary = await ItineraryModel.findByIdAndUpdate(
      id,
      {
        Name, //
        Activities, //
        Location, //
        TourGuide: tourGuide, //
        StartDate, //
        EndDate, //
        Language, //
        Price, //
        DatesAndTimes, //
        Accesibility, //
        Pickup, //
        Dropoff, //
        // Category,
        // Tag,
        Image, //
        Rating, //
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("TourGuide");
    // .populate("Tag")
    // .populate("Category")

    // console.log("==============================");
    // console.log(itinerary);
    // console.log("==============================");

    if (!itinerary)
      return res
        .status(404)
        .json({ msg: "Cannot find any Itinerary with id ${id}" });

    return res.status(200).json("changed Itinerary Info successfully");
  } catch (e) {
    res.status(400).json({ msg: "Operation Failed" });
  }
};
const deleteItinerary = async (req, res) => {
  const { id } = req.params;

  const tourGuide = await tourGuideModel.findOne({ UserId: req._id }, "UserId");

  const deletedItinerary = await ItineraryModel.findById(id);

  if (
    !deletedItinerary ||
    deletedItinerary.TourGuide.toString() !== tourGuide?._id.toString()
  )
    return res.status(400).json({ message: "Unauthorized TourGuide!" });

  try {
    const itinerary = await ItineraryModel.findByIdAndDelete(id);
    if (!itinerary)
      return res
        .status(404)
        .json({ msg: "Cannot find any Itinerary with id ${id}" });

    return res.status(200).json("Itinerary deleted sucessfully");
  } catch (e) {
    res.status(400).json({ msg: "Operation Failed" });
  }
};

const getMyItineraries = async (req, res) => {
  const tourGuide = await tourGuideModel.findOne({ UserId: req._id }, "UserId");

  if (!tourGuide) return res.status(400).json({ message: "Unauthorized User!" });

  try {
    const itineraries = await ItineraryModel.find({ TourGuide: tourGuide._id })
      .populate("Tag")
      .populate("Category")
      .populate("TourGuide");

    return res.status(200).json(itineraries);
  } catch (e) {
    res.status(400).json({ msg: "Failed to find itinerary" });
  }
}

const flagItinerary = async (req, res) => {
  const { id } = req.params;

  try {
    const itinerary = await ItineraryModel.findByIdAndUpdate(id, { Inappropriate: true }, { new: true });

    if(!itinerary) return res.status(404).json({ msg: `Cannot find any Itinerary with id ${id}` });
    return res.status(200).json("Itinerary flagged successfully");
  }
  catch (e) {
    res.status(400).json({ msg: "Operation Failed" });
  }
}

const createItineraryBooking = async (req, res) => {
  const { id } = req.params;

  
  try {
    const itinerary = await ItineraryModel.findById(id)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: itinerary.Name,
            },
            unit_amount: Math.round(itinerary.Price),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/itineraries/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/itineraries/${id}`,
    })

    res.status(200).json({ url: session.url });
    // const itinerary = await ItineraryModel.findByIdAndUpdate(
    //   id,
    //   [
    //     {
    //       $set: {
    //         RemainingBookings: {
    //           $cond: {
    //             if: { $gt: ["$RemainingBookings", 0] },
    //             then: { $subtract: ["$RemainingBookings", 1] },
    //             else: "$RemainingBookings"
    //           }
    //         }
    //       }
    //     }
    //   ], 
    //   { new: true });
  }
  catch (e) {
    res.status(400).json({ msg: "Operation Failed" });
  }
}

const acceptItineraryBooking = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
    
  try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
  } catch (err) {
      // console.error('Webhook Error:', err.message);
      // return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if(req.body.type === 'checkout.session.completed') {
    
  }
}

module.exports = {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  getMyItineraries,
  flagItinerary,
  createItineraryBooking
};
