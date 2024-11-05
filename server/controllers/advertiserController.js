const bcrypt = require("bcrypt");

const advertiserModel = require("../models/Advertiser.js");
const userModel = require("../models/User.js");
const CompanyProfile = require("../models/CompanyProfile.js");
const createAdvertiser = async (req, res) => {
  const { UserName, Email, Password, Website, Hotline, Document, CompanyName, CompanyDescription } =
    req.body;
  try {
    if (
      !UserName ||
      !Email ||
      !Password ||
      !Website ||
      !Hotline ||
      !CompanyName ||
      !CompanyDescription ||
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
      Document,
    });
    
    const newCompanyProfile = await CompanyProfile.create({
      Name: CompanyName,
      Description: CompanyDescription,
      Website,
      Hotline,
      AdvertiserId: newadvertiser._id,
    })

    newadvertiser.CompanyProfile = newCompanyProfile._id;
    await newadvertiser.save();

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
    const { accepted, application } = req.query;
    if(accepted) 
    {
      const advertisers = await advertiserModel.find({ Accepted: true }).populate("UserId");
      res.status(200).json(advertisers);
    }
    else if(application)
    {
      const advertisers = await advertiserModel.find({ Accepted: null }).populate("UserId");
      res.status(200).json(advertisers);
    }
    else
    {
      const advertisers = await advertiserModel.find().populate("UserId");
      res.status(200).json(advertisers);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving advertisers", error });
  }
};

const getAdvertiserActivities = async (req, res) => {
  if (!req._id)
    return res.status(400).json({ message: "Unauthorized Advertiser!" });

  try {
    const activities = await advertiserModel
      .findOne({ UserId: req._id }, "Activities")
      .lean()
      .populate("Activities");
    if (!activities)
      return res.status(400).json({ message: "No Activities where found!" });
    return res.status(200).json(activities);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAdvertiserById = async (req, res) => {
  const { id } = req.params;
  //const { Username, Email, Password, Website, Hotline, Profile, Accepted } = req.body;

  try {
    const findAdvertiser = await advertiserModel
      .findById(id)
      .populate("UserId")
      .populate("CompanyProfile");

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
  const { UserName, Email, Website, Hotline, Document, Image } = req.body;

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

    console.log("Image: ", Image)

    const updatedAdvertiser = await advertiserModel.findByIdAndUpdate(
      id,
      { Document, Image: Image ?? (advertiser.Image ?? "") },
      { new: true }
    );

    await CompanyProfile.findByIdAndUpdate(
      updatedAdvertiser.CompanyProfile,
      { Website, Hotline },
      { new: true }
    )

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
    const deletedUser = await userModel.findByIdAndDelete(deletedAdvertiser.UserId);

    if (!deletedAdvertiser) {
      return res.json({ message: "Advertiser not found" });
    }

    if (!deletedUser) {
      return res.json({ message: "User not found" });
    }

    res.status(200).json({ message: "Advertiser deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting advertiser", error });
  }
};

const acceptAdvertiser = async (req, res) => {
  const { id } = req.params;

  try {
    const advertiser = await advertiserModel.findById(id);
    if (advertiser.Accepted)
      return res
        .status(400)
        .json({ message: "Advertiser is already accepted!" });
    advertiser.Accepted = true;
    await advertiser.save();
    res.status(200).json({ message: "Advertiser accepted successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error accepting advertiser", error: e.message });
  }
};

const rejectAdvertiser = async (req, res) => {
  const { id } = req.params;

  try {
    const advertiser = await advertiserModel.findById(id);
    if (advertiser.Accepted)
      return res
        .status(400)
        .json({ message: "Advertiser is already accepted!" });
    advertiser.Accepted = false;
    await advertiser.save();
    res.status(200).json({ message: "Advertiser rejected successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error rejecting advertiser", error: e.message });
  }
};
// const deletAll = async (req, res) => {
//   try {
//     await advertiserModel.deleteMany({});
//     res.status(200).json("yess");
//   } catch {
//     res.status(500).json("noo");
//   }
// };

module.exports = {
  createAdvertiser,
  getAdvertisers,
  getAdvertiserById,
  updateAdvertiser,
  deleteAdvertiser,
  getAdvertiserActivities,
  acceptAdvertiser,
  rejectAdvertiser
};
