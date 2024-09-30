const userModel = require("../models/User.js");
const tourguideModel = require("../models/Tourguide.js");
const { default: mongoose } = require("mongoose");

const createTourguideProfile = async (req, res) => {
  const { UserName, Email, Password, MobileNumber, YearsOfExperience, PreviousWork, Accepted } =
    req.body;
  try {
    if (
      !UserName ||
      !Email ||
      !Password ||
      !MobileNumber ||
      !YearsOfExperience ||
      !Accepted
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
    //const hashedPwd = await bcrypt.hash(Password, 10);
    const user = await userModel.create({
      UserName,
      Email,
      Password,
      Role: "TourGuide",
    });
    const tourguide = await tourguideModel.create({
      MobileNumber,
      YearsOfExperience,
      PreviousWork,
      UserId: user._id,
      Accepted,
    });
    res.status(200).json(tourguide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
    const tourguide = await tourguideModel.findById(id);
    res.status(200).json({ message: "Tourguide found successfully",tourGuide: tourguide});
    if (!tourguide) {
      return res.status(404).json({message: "No tour guides found"});
    }
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

const deleteTourGuide = async (req, res) => {
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

module.exports = {
  createTourguideProfile,
  getTourguideProfile,
  updateTourguideProfile,
  allTourguides,
  deleteTourGuide
};
