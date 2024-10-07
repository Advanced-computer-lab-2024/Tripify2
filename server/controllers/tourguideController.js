const userModel = require("../models/User.js");
const tourguideModel = require("../models/Tourguide.js");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const { default: mongoose } = require("mongoose");

const createTourguideProfile = async (req, res) => {
  const {
    UserName,
    Email,
    Password,
    MobileNumber,
    YearsOfExperience,
    PreviousWork,
    Documents,
  } = req.body;
  try {
    if (
      !UserName ||
      !Email ||
      !Password ||
      !MobileNumber ||
      !YearsOfExperience ||
      !Documents
    ) {
      return res.status(400).json({ message: "All Fields Must Be Given!" });
    }
    const duplicateUserEmail = await userModel.findOne({ Email });
    const duplicateUserName = await userModel.findOne({ UserName });
    if (duplicateUserEmail) {
      return res.status(400).json({ message: "Email Already Exists!" });
    }
    if (duplicateUserName) {
      return res.status(400).json({ message: "UserName Already Exists!" });
    }
    const hashedPwd = await bcrypt.hash(Password, 10);
    console.log(hashedPwd);
    const user = await userModel.create({
      UserName,
      Email,
      Password: hashedPwd,
      Role: "TourGuide",
    });
    const tourGuide = await tourguideModel.create({
      MobileNumber,
      YearsOfExperience,
      PreviousWork: PreviousWork ?? "",
      Documents,
      UserId: user._id,
    });

    res.status(201).json({
      message: "TourGuide created successfully",
      TourGuide: tourGuide,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error creating TourGuide ${error.message}`, error });
  }
};

const getTourguideItineraries = async (req, res) => {
  if (!req?._id)
    return res.status(400).json({ message: "Unauthorized TourismGovernor!" });

  try {
    const itineraries = await tourguideModel
      .findOne({ UserId: req._id }, "Itineraries")
      .populate("Itineraries")
      .lean();
    if (!itineraries)
      return res.status(400).json({ message: "No Itineraries where found!" });
    return res.status(200).json(itineraries);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const allTourguides = async (req, res) => {
  try {
    const { accepted, application } = req.query;
    if (accepted) {
      const tourguides = await tourguideModel
        .find({ Accepted: true })
        .populate("UserId")
        .populate("Itineraries");

      if (!tourguides)
        return res.status(400).json({ message: "No tour guides found!" });
      return res.status(200).json(tourguides);
    } else if (application) {
      const tourguides = await tourguideModel
        .find({ Accepted: null })
        .populate("UserId")
        .populate("Itineraries");

      if (!tourguides)
        return res.status(400).json({ message: "No tour guides found!" });
      return res.status(200).json(tourguides);
    } else {
      const tourguides = await tourguideModel
        .find({})
        .populate("UserId")
        .populate("Itineraries");

      if (!tourguides)
        return res.status(400).json({ message: "No tour guides found!" });
      return res.status(200).json(tourguides);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTourguideProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const tourguide = await tourguideModel
      .findById(id)
      .populate("UserId")
      .populate("Itineraries");

    res
      .status(200)
      .json({ message: "Tourguides read successfully", tourguide: tourguide });
    if (tourguide.length === 0) {
      return res.status(404).json({
        message: "No tour guides found",
      });
    }
    res.status(200).json(tourguide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourguideProfile = async (req, res) => {
  const { MobileNumber, YearsOfExperience, PreviousWork, Accepted } = req.body;
  const { id } = req.params;
  try {
    const updatedUser = await tourguideModel.findById(id);
    if (updatedUser.Accepted) {
      if (updatedUser) {
        updatedUser.MobileNumber = MobileNumber;
        updatedUser.YearsOfExperience = YearsOfExperience;
        updatedUser.PreviousWork = PreviousWork;
        updatedUser.Accepted = Accepted;
        await updatedUser.save();
        res
          .status(200)
          .json({ message: "Update is successful", tourGuide: updatedUser });
      }
    } else {
      res.status(400).json({
        message: "Cannot update: Tourguide is not accepted yet by Admin",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTourguide = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTourGuide = await tourguideModel.findByIdAndDelete(id);
    const deletedUser = await userModel.findByIdAndDelete(
      deletedTourGuide.UserId
    );

    if (!deletedTourGuide) {
      return res.json({ message: "Tour guide not found" });
    }

    if (!deletedUser) {
      return res.json({ message: "User not found" });
    }

    res.status(200).json({ message: "Tour guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tour guide", error });
  }
};

const acceptTourGuide = async (req, res) => {
  const { id } = req.params;

  try {
    const tourGuide = await tourguideModel.findById(id);
    if (tourGuide.Accepted)
      return res
        .status(400)
        .json({ message: "TourGuide is already accepted!" });
    tourGuide.Accepted = true;
    await tourGuide.save();
    res.status(200).json({ message: "TourGuide accepted successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error accepting tourGuide", error: e.message });
  }
};

const rejectTourGuide = async (req, res) => {
  const { id } = req.params;

  try {
    const tourGuide = await tourguideModel.findById(id);
    if (tourGuide.Accepted)
      return res
        .status(400)
        .json({ message: "TourGuide is already accepted!" });
    tourGuide.Accepted = false;
    await tourGuide.save();
    res.status(200).json({ message: "TourGuide rejected successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error rejecting tourGuide", error: e.message });
  }
};

module.exports = {
  createTourguideProfile,
  getTourguideProfile,
  updateTourguideProfile,
  allTourguides,
  getTourguideItineraries,
  deleteTourguide,
  acceptTourGuide,
  rejectTourGuide,
};
