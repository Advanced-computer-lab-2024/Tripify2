const userModel = require("../models/User.js");
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
      Role: "TourGuide",
    });

    await newUser.save();
    const tourguide = await userModel.create({
      MobileNumber,
      YearsOfExperience,
      PreviousWork,
      UserId,
      Accepted,
      Documents,
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

    const tourguides = await tourguideModel.find({ _id: { $in: arrayIds } });
    if (!tourguides)
      return res.status(400).json({ message: "No tour guides found!" });
    return res.status(200).json(tourguides);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getTourguideProfile = async (req, res) => {
  const {id} = req.params
  try {
    const tourguide = await userModel.find({ Accepted: true });
    res.status(200).json({ message: "Tourguides read successfully" });
    if (acceptedTourGuides.length === 0) {
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
  const {id} = req.params
  try {
    
      const updatedUser = await tourguideModel.findById(id);
    if (updatedUser.Accepted) { 
      if (updatedUser){
        updatedUser.MobileNumber = MobileNumber;
        updatedUser.YearsOfExperience = YearsOfExperience;
        updatedUser.PreviousWork = PreviousWork;
        updatedUser.Accepted = Accepted;
        await updatedUser.save();
        res.status(200).json({message:"Update is successful",tourGuide: updatedUser});
      }
      
    } else {
      res
        .status(400)
        .json({ message: "Cannot update: Tourguide is not accepted yet by Admin" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTourguide = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTourGuide = await tourguideModel.findByIdAndDelete(id);

    if (!deletedTourGuide) {
      return res.json({ message: "Tour guide not found" });
    }

    res.status(200).json({ message: "Tour guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tour guide", error });
  }
};

const acceptTourGuide = async (req, res) => {
  const { id } = req.params

  try
  {
    const tourGuide = await tourguideModel.findById(id)
    if(tourGuide.Accepted) return res.status(400).json({'message': 'TourGuide is already accepted!'})
    tourGuide.Accepted = true
    await tourGuide.save()
    res.status(200).json({message: 'TourGuide accepted successfully!'})
  }
  catch(error)
  {
    return res.status(500).json({ message: 'Error accepting tourGuide', error: e.message })
  }
}

module.exports = {
  createTourguideProfile,
  getTourguideProfile,
  updateTourguideProfile,
  allTourguides,
  getTourguideItineraries,
  deleteTourguide,
  acceptTourGuide
};
