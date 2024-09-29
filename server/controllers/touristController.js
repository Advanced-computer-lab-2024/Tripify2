const touristModel = require("../models/Tourist.js");
const userModel = require("../models/User.js");
const bcrypt = require("bcrypt");

const createTourist = async (req, res) => {
  const { UserName, Email, Password, MobileNumber, Nationality, DOB, Occupation, Wallet } =
    req.body;

  try {
    if (!UserName || !Email || !Password)
      return res.status(400).json({ message: "All Fields Must Be Given!" });
  
    const duplicateUser = await userModel.findOne({ Email });
  
    if (duplicateUser)
      return res.status(400).json({ message: "Email Already Exists!" });
  
    const hashedPwd = await bcrypt.hash(Password, 10);
  
    const user = await userModel.create({
      UserName,
      Email,
      Password: hashedPwd,
      Role: "Tourist",
    });

    const existingTourist = await touristModel.findOne({ UserId: user._id });

    if (existingTourist) {
      return res.status(409).json({
        message: "Tourist with this UserId already exists",
      });
    }

    const newTourist = new touristModel({
      MobileNumber,
      Nationality,
      DOB,
      Occupation,
      Wallet,
      UserId: user._id
    });
    await newTourist.save();
    res.status(201).json({
      message: "Tourist created successfully",
      tourist: newTourist,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating tourist", error });
  }
};

const getTourists = async (req, res) => {
  try {
    const tourists = await touristModel.find({});
    res.status(200).json(tourists);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tourists", error });
  }
};

const getTourist = async (req, res) => {
  try {
    const { id } = req.params;
    const tourist = await touristModel.findById(id);
    if (!tourist) return res.status(404).json({ msg: "Tourist not found" });
    return res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tourist", error });
  }
};

const updateTourist = async (req, res) => {
  const { id } = req.params;
  const {
    MobileNumber,
    Nationality,
    DOB,
    Occupation,
    Email,
    Password,
    UpcomingPlaces,
    UpcomingActivities,
    UpcomingItineraries,
    Wishlist,
    /* Wallet, */
  } = req.body;

  try {
    const tourist = await touristModel.findById(id);

    if (!tourist) {
      return res.status(404).json({
        message: "Tourist not found",
      });
    }

    if (Email || Password) {
      const user = await userModel.findById(tourist.UserId);

      if (!user) {
        return res.status(404).json({
          message: "(Tourist) User not found",
        });
      }

      if (Email) {
        user.Email = Email;
      }

      if (Password) {
        user.Password = Password;
      }

      await user.save();
    }

    if (MobileNumber) {
      tourist.MobileNumber = MobileNumber;
    }

    if (Nationality) {
      tourist.Nationality = Nationality;
    }

    if (DOB) {
      tourist.DOB = DOB;
    }

    if (Occupation) {
      tourist.Occupation = Occupation;
    }

    if (UpcomingPlaces) {
      tourist.UpcomingPlaces = UpcomingPlaces;
    }

    if (UpcomingActivities) {
      tourist.UpcomingActivities = UpcomingActivities;
    }

    if (UpcomingItineraries) {
      tourist.UpcomingItineraries = UpcomingItineraries;
    }

    if (Wishlist) {
      tourist.Wishlist = Wishlist;
    }

    await tourist.save();

    res.status(200).json({
      message: "Tourist updated successfully",
      tourist,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating tourist ", error });
  }
};

const deleteTourist = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTourist = await touristModel.findByIdAndDelete(id);

    if (!deletedTourist) {
      return res.json({ message: "Tourist not found" });
    }

    res.status(200).json({ message: "Tourist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tourist", error });
  }
};

module.exports = {
  createTourist,
  getTourists,
  getTourist,
  updateTourist,
  deleteTourist,
};
