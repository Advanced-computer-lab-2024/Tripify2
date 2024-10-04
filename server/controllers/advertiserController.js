const bcrypt = require("bcrypt");

const advertiserModel = require("../models/Advertiser.js");
const userModel = require("../models/User.js");
const createAdvertiser = async (req, res) => {
  const {
    UserName,
    Email,
    Password,
    Website,
    Hotline,
    Profile,
    Accepted,
    Document,
  } = req.body;
  // console.log(req.body);
  try {
    if (
      !UserName ||
      !Email ||
      !Password ||
      !Website ||
      !Hotline ||
      !Profile ||
      !Accepted ||
      !Document
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
      Role: "Advertiser",
    });
    const newadvertiser = await advertiserModel.create({
      UserId: user._id,
      Website,
      Hotline,
      Profile,
      Accepted,
      Document,
    });
    // await newadvertiser.save();
    res.status(201).json({
      message: "Advertiser created successfully",
      tourist: newadvertiser,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating Advertiser", error });
  }
};
const getAdvertisers = async (req, res) => {
  try {
    const advertisers = await advertiserModel.find();
    res.status(200).json(advertisers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving advertisers", error });
  }
};

const getAdvertiserById = async (req, res) => {
  const { id } = req.params;
  //const { Username, Email, Password, Website, Hotline, Profile, Accepted } = req.body;

  try {
    const findAdvertiser = await advertiserModel
      .findById(id)
      .populate("UserId");

    // console.log(findAdvertiser);

    // console.log(findAdvertiser.UserId.UserName)
    if (!findAdvertiser) {
      return res.json({ message: "Advertiser not found" });
    }

    res
      .status(200)
      .json({ message: "Advertiser found", advertiser: findAdvertiser });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving advertiser", error });
  }
};

const updateAdvertiser = async (req, res) => {
  const { id } = req.params;
  const { UserName, Email, Website, Hotline, Profile, Document } = req.body;

  try {
    const advertiser = await advertiserModel.findById(id).populate("UserId");

    const duplicatedUserEmail = await userModel.findOne({ Email });
    const duplicatedUserName = await userModel.findOne({ UserName });
    if (
      duplicatedUserEmail &&
      duplicatedUserEmail._id.toString() !== advertiser.UserId._id.toString()
    ) {
      return res.status(500).json({ message: "Email already in use" });
    }

    if (
      duplicatedUserName &&
      duplicatedUserName._id.toString() !== advertiser.UserId._id.toString()
    ) {
      return res.status(500).json({ message: "Username already taken" });
    }
    const userId = advertiser.UserId._id;
    // console.log(userId);

    await userModel.findByIdAndUpdate(
      userId,
      { UserName, Email }, // Update UserName and Email
      { new: true }
    );

    const updatedAdvertiser = await advertiserModel.findByIdAndUpdate(
      id,
      { Website, Hotline, Profile, Document },
      { new: true }
    );

    res.status(200).json({
      message: "Advertiser and user updated successfully",
      advertiser: updatedAdvertiser,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating advertiser", error });
  }
};

const deleteAdvertiser = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedAdvertiser = await advertiserModel.findByIdAndDelete(id);

    if (!deletedAdvertiser) {
      return res.json({ message: "Advertiser not found" });
    }

    res.status(200).json({ message: "Advertiser deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting advertiser", error });
  }
};

module.exports = {
  createAdvertiser,
  getAdvertisers,
  getAdvertiserById,
  updateAdvertiser,
  deleteAdvertiser,
};
