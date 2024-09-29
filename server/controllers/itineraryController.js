const { default: mongoose } = require("mongoose");
const ItineraryModel = require("../models/Itinerary.js");

const createItinerary = async (req, res) => {
  //add a new itinerary to the database with
  //ctivities, Locations, Timeline, DurationOfActivity, Language, Price, DatesAndTimes, Accesibility, Pickup, and Dropoff
  const {
    Activities,
    Locations,
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
  } = req.body;
  try {
    const itinerary = await ItineraryModel.create({
      Activities,
      Locations,
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
    });
    res
      .status(200)
      .json({ msg: "Itinerary created Successfully\n", itinerary });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
};
const getItineraries = async (req, res) => {
  try {
    const itineraries = await ItineraryModel.find({});

    return res.status(200).json(itineraries);
  } catch (e) {
    res.status(400).json({ msg: "Failed to find itinerary" });
  }
};

const getItinerary = async (req, res) => {
  const { id } = req.params;
  try {
    const itinerary = await ItineraryModel.findById(id);
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
  try {
    const itinerary = await ItineraryModel.findByIdAndUpdate(id, req.body);
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
