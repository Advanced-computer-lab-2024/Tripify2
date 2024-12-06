const { default: mongoose } = require("mongoose");
const ItineraryModel = require("../models/Itinerary.js");
const tourGuideModel = require("../models/Tourguide.js");
const TagModel = require("../models/Tag");
const CategoryModel = require("../models/Category");
const NotificationService = require('../config/notification.service');
const notificationService = new NotificationService();

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
    RemainingBookings
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
      RemainingBookings
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
  const { categories, tags } = req.query;

  // await notificationService.createNotification({
  //   Message: 'New Itinerary Created' + new Date().toLocaleString(),
  //   TargetRoute: '/itinerary',
  //   Type: 'success',
  //   UserId: '6704edde8eb50e6de0f16da6'
  // })

  try {
    if (!categories || !tags || categories?.length === 0 || tags?.length === 0) {
      console.log("categories inside")
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
    }
    else {
      console.log("categories: ", categories)
      console.log("tags: ", tags)
      const itineraries = await ItineraryModel.find({ Category: { $in: categories.split('-') }, Tag: { $in: tags.split('-') }, Inappropriate: false | null })
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
    }
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
    RemainingBookings
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
  ) {
    console.log("Unauthorized TourGuide!")
    return res.status(400).json({ message: "Unauthorized TourGuide!" });
  }

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
        RemainingBookings
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("TourGuide").catch((e) => console.log(e));
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
// const updateItinerary = async (req, res) => {
//   const { id } = req.params;
//   const {
//     Name,
//     Activities,
//     Location,
//     StartDate,
//     EndDate,
//     Language,
//     Price,
//     DatesAndTimes,
//     Accesibility,
//     Pickup,
//     Dropoff,
//     Category,
//     Tag,
//     Image,
//     Rating,
//     RemainingBookings,
//   } = req.body;

//   try {
//     // Update the itinerary document
//     const updatedItinerary = await ItineraryModel.findByIdAndUpdate(
//       id,
//       {
//         Name,
//         Activities,
//         Location,
//         StartDate,
//         EndDate,
//         Language,
//         Price,
//         DatesAndTimes,
//         Accesibility,
//         Pickup,
//         Dropoff,
//         Category,
//         Tag,
//         Image,
//         Rating,
//         RemainingBookings, // Update RemainingBookings field
//       },
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Ensure validation rules are applied
//       }
//     ).populate("Tag").populate("Category").populate("TourGuide");

//     // If the itinerary is not found
//     if (!updatedItinerary) {
//       return res.status(404).json({ message: `Cannot find any Itinerary with id ${id}` });
//     }

//     // Respond with the updated itinerary
//     return res.status(200).json({
//       message: "Itinerary updated successfully!",
//       itinerary: updatedItinerary,
//     });
//   } catch (error) {
//     // Handle errors and respond with a clear message
//     return res.status(500).json({ message: error.message });
//   }
// };


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
    const itinerary = await ItineraryModel.findById(id)
    itinerary.Inappropriate = !itinerary.Inappropriate

    await itinerary.save()

    if (itinerary.Inappropriate) {
      const tourGuide = await tourGuideModel.findById(itinerary.TourGuide, "UserId").populate("UserId");

      await Promise.all([
        notificationService.createNotification({
          Message: "The Itinerary ''" + itinerary.Name + "'' has been flagged as inappropriate",
          TargetRoute: '/itinerary/' + id,
          Type: 'error',
          UserId: tourGuide.UserId._id.toString()
        }),
        notificationService.sendEmail({
          recipientEmail: tourGuide.UserId.Email,
          subject: "Tripify: Inappropriate Itinerary Flagged",
          content: "The Itinerary '" + itinerary.Name + "' has been flagged as inappropriate"
        })
      ])
    }
    // const itinerary = await ItineraryModel.findByIdAndUpdate(id, { Inappropriate: true }, { new: true });

    if (!itinerary) return res.status(404).json({ msg: `Cannot find any Itinerary with id ${id}` });
    return res.status(200).json("Itinerary flagged successfully");
  }
  catch (e) {
    res.status(400).json({ msg: "Operation Failed" });
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
};
