const { convertToUSD } = require("../config/currencyHelpers.js");
const touristModel = require("../models/Tourist.js");
const userModel = require("../models/User.js");
const bcrypt = require("bcrypt");

const createTourist = async (req, res) => {
  const {
    UserName,
    Email,
    Password,
    MobileNumber,
    Nationality,
    DOB,
    Occupation,
    Wallet,
  } = req.body;

  try {
    if (!UserName || !Email || !Password)
      return res.status(400).json({ message: "All Fields Must Be Given!" });

    const duplicateUser = await userModel.findOne({ Email });

    console.log(duplicateUser);

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
      UserName,
      MobileNumber,
      Nationality,
      DOB,
      Occupation,
      Wallet,
      UserId: user._id,
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
    const tourists = await touristModel.find({}).populate("UserId");
    res.status(200).json(tourists);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tourists", error });
  }
};

const getTourist = async (req, res) => {
  try {
    const { id } = req.params;
    const tourist = await touristModel.findById(id).populate("UserId");
    if (!tourist) return res.status(404).json({ msg: "Tourist not found" });
    return res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tourist", error });
  }
};
const getCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await touristModel.findById(id).populate({
      path: "Cart.product",
      select: "Name Price Image AvailableQuantity Archived",
    });

    if (!user || user.Cart.length === 0) {
      return res.status(404).json("No products found in the cart");
    }

    res.status(200).json(user.Cart); // Send the populated cart
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while retrieving the cart");
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
    BookmarkedItinerary,
    BookmarkedActivity,
    Cart,
    Address,
    // Wallet,
  } = req.body;

  try {
    const tourist = await touristModel.findById(id);

    if (!tourist)
      return res.status(404).json({
        message: "Tourist not found",
      });

    if (Email || Password) {
      const user = await userModel.findById(tourist.UserId);

      if (!user)
        return res.status(404).json({
          message: "(Tourist) User not found",
        });

      if (Email) user.Email = Email;

      if (Password) user.Password = Password;

      await user.save();
    }

    if (MobileNumber) tourist.MobileNumber = MobileNumber;

    if (Nationality) tourist.Nationality = Nationality;

    if (DOB) tourist.DOB = DOB;

    if (Occupation) tourist.Occupation = Occupation;

    if (UpcomingPlaces) tourist.UpcomingPlaces = UpcomingPlaces;

    if (UpcomingActivities) tourist.UpcomingActivities = UpcomingActivities;

    if (UpcomingItineraries) tourist.UpcomingItineraries = UpcomingItineraries;

    if (Wishlist) tourist.Wishlist = Wishlist;

    if (BookmarkedItinerary) tourist.BookmarkedItinerary = BookmarkedItinerary;

    if (BookmarkedActivity) tourist.BookmarkedActivity = BookmarkedActivity;

    if (Cart) tourist.Cart = Cart;

    if (Address) tourist.Address = Address;

    // if (Wallet) tourist.Wallet = Wallet;

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
    const deletedUser = await userModel.findByIdAndDelete(
      deletedTourist.UserId
    );

    if (!deletedTourist) {
      return res.json({ message: "Tourist not found" });
    }

    if (!deletedUser) {
      return res.json({ message: "User not found" });
    }

    res.status(200).json({ message: "Tourist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tourist", error });
  }
};

// const deleteAll = async (req, res) => {
//   try {
//     const deleteMany = await touristModel.deleteMany({});
//     return res.status(200).json({ message: "All tourist records deleted!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const redeemPoints = async (req, res) => {
  try {
    const tourist = await touristModel
      .findOne({ UserId: req._id })
      .lean()
      .exec();

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const LoyaltyPoints = tourist.LoyaltyPoints;

    const newWallet =
      Number(tourist.Wallet) +
      Number(convertToUSD(LoyaltyPoints * 0.01, "EGP"));

    await touristModel
      .findOneAndUpdate(
        { UserId: req._id },
        { Wallet: newWallet, LoyaltyPoints: 0 },
        { new: true }
      )
      .exec();

    res.status(200).json({ message: "Points redeemed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error redeeming points", error });
  }
};

module.exports = {
  createTourist,
  getTourists,
  getTourist,
  updateTourist,
  deleteTourist,
  redeemPoints,
  getCart,
};
