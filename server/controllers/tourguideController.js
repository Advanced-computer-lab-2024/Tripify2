const userModel = require("../models/Tourguide.js");
const tourguideModel = require("../models/Tourguide.js");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

const createTourguideProfile = async (req, res) => {
  const { UserName, Email, Password, MobileNumber, YearsOfExperience, PreviousWork, Accepted, Documents } =
    req.body;
    
  if(!Email || !Password || !UserName) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    try {
    const duplicateEmail = await User.findOne({ Email }, "_id").lean().exec();

    if(duplicateEmail) return res.status(400).json({'message': 'Email Already Exists!'})

    const duplicateUserName = await User.findOne({ UserName }, "_id").lean().exec();
    if(duplicateUserName) return res.status(400).json({'message': 'UserName Already Exists!'})

    const hashedPwd = await bcrypt.hash(Password, 10);

    const newUser = new User({
      Email,
      Password: hashedPwd,
      UserName,
      Role: "TourismGovernor",
    });

    await newUser.save();
    const tourguide = await userModel.create({
      MobileNumber,
      YearsOfExperience,
      PreviousWork,
      UserId: newUser._id,
      Accepted,
      Documents,
      Itineraries: []
    });
    res.status(200).json(tourguide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTourguideItineraries = async (req, res) => {
  if(!req?._id) return res.status(400).json({'message': 'Unauthorized TourismGovernor!'})

  try 
  {
    const itineraries = await tourguideModel.findOne({ UserId: req._id }, "Itineraries").lean().populate("Itineraries");
    if (!itineraries) return res.status(400).json({ message: "No Itineraries where found!" });
    return res.status(200).json(itineraries);
  } 
  catch (error) 
  {
    return res.status(500).json({ message: error.message });
  }
}

const allTourguides = async (req, res) => {
  try {
    const tourguideIds = await tourguideModel.find({}).select("_id");
    const arrayIds = tourguideIds.map((tourguide) => tourguide._id);

    const tourguides = await userModel.find({ _id: { $in: arrayIds } });
    if (!tourguides)
      return res.status(400).json({ message: "No tour guides found!" });
    return res.status(200).json(tourguides);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getTourguideProfile = async (req, res) => {
  const { MobileNumber, YearsOfExperience, PreviousWork, UserId, Accepted } =
    req.body;
  try {
    const tourguide = await userModel.find({ Accepted: true });
    // res.status(200).json({ message: "Tourguides read successfully" });
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
  const { MobileNumber, YearsOfExperience, PreviousWork, UserId, Accepted, Documents } =
    req.body;
  try {
    if (Accepted) {
      const updatedUser = await userModel.findOne({ UserId: req.body.UserId });
      updatedUser.MobileNumber = req.body.MobileNumber;
      updatedUser.YearsOfExperience = req.body.YearsOfExperience;
      updatedUser.PreviousWork = req.body.PreviousWork;
      await updatedUser.save();

      res.status(200).json(" Update is successful");
    } else {
      res
        .status(400)
        .json({ message: "Tourguide is not accepted yet by Admin" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTourguideProfile,
  getTourguideProfile,
  updateTourguideProfile,
  allTourguides,
  getTourguideItineraries,
};
