const activityModel = require("../models/Activity.js");

const createActivity = async (req, res) => {
  const {
    Name,
    Date,
    Time,
    Location,
    Price,
    CategoryId,
    Tags,
    SpecialDiscounts,
    AdvertiserId,
    Duration,
  } = req.body;

  try {
    const newActivity = new activityModel({
      Name,
      Date,
      Time,
      Location,
      Price,
      CategoryId,
      Tags,
      SpecialDiscounts,
      AdvertiserId,
      Duration,
    });
    await newActivity.save();
    res.status(201).json({
      message: "Advertiser created successfully",
      activity: newActivity,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating advertiser", error });
  }
};

const getActivity = async (req, res) => {
  try {
    const activity = await activityModel.find();
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving advertisers", error });
  }
};

const getActivityById = async (req, res) => {
  const { id } = req.params;
  //const { Username, Email, Password, Website, Hotline, Profile, Accepted } = req.body;

  try {
    const findActivity = await activityModel.findById(id);

    if (!findActivity) {
      return res.json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity found", activity: findActivity });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving activity", error });
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.body;
  const {
    Name,
    Date,
    Time,
    Location,
    Price,
    CategoryId,
    Tags,
    SpecialDiscounts,
    AdvertiserId,
    Duration,
    Inappropriate,
  } = req.body;

  try {
    const updatedActivity = await activityModel.findByIdAndUpdate(
      id,
      {
        Name,
        Date,
        Time,
        Location,
        Price,
        CategoryId,
        Tags,
        SpecialDiscounts,
        AdvertiserId,
        Duration,
        Inappropriate,
      },
      { new: true }
    );

    if (!updatedActivity) {
      return res.json({ message: "Activity not found" });
    }

    res.status(200).json({
      message: "Activity updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating activity", error });
  }
};

const deleteActivity = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedActivity = await activityModel.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity", error });
  }
};

module.exports = {
  createActivity,
  getActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
};
