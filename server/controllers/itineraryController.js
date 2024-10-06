const { default: mongoose } = require("mongoose");
const ItineraryModel = require("../models/Itinerary.js");
const tourGuideModel = require("../models/Tourguide.js");
const TagModel = require("../models/Tag");
const CategoryModel = require("../models/Category");

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
    res
      .status(200)
      .json({ msg: "Itinerary created Successfully\n", itinerary });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};
const getItineraries = async (req, res) => {
  try {
    const itineraries = await ItineraryModel.find({})
      .populate("Tag")
      .populate("Category")
      .populate("TourGuide");

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

  const tourGuide = await tourGuideModel.findOne({ UserId: req._id }, "UserId");

  const updatedItinerary = await ItineraryModel.findById(id);

  if (
    !updatedItinerary ||
    updatedItinerary.TourGuide.toString() !== tourGuide._id.toString()
  )
    return res.status(400).json({ message: "Unauthorized TourGuide!" });

  try {
    const itinerary = await ItineraryModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("Tag")
      .populate("Category")
      .populate("TourGuide");

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
    deletedItinerary.TourGuide.toString() !== tourGuide._id.toString()
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

module.exports = {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
};
