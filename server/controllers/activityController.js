const activityModel = require("../models/Activity.js");
const TagModel = require("../models/Tag");
const CategoryModel = require("../models/Category");

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
    Image,
  } = req.body;

  try {
    if (!Tags || Tags.length === 0) {
      return res.status(400).json({ message: "Please provide valid tags" });
    }
    if (!CategoryId || CategoryId.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide valid categories" });
    }
    const foundTags = await TagModel.find({ _id: { $in: Tags } });
    const foundCategories = await CategoryModel.find({
      _id: { $in: CategoryId },
    });

    if (foundTags.length !== Tags.length) {
      return res.status(400).json({ message: "One or more Tags are invalid" });
    }
    if (foundCategories.length !== CategoryId.length) {
      return res
        .status(400)
        .json({ message: "One or more Categories are invalid" });
    }

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
      Image,
    });
    //await newActivity.save();
    res.status(201).json({
      message: "Activity created successfully",
      activity: newActivity,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating advertiser", error });
  }
};

const getActivity = async (req, res) => {
  try {
    const activity = await activityModel.find().populate();
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Activity", error });
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
  const { id } = req.params;
  const { Name, ...rest } = req.body;
  try {
    const updatedActivity = await activityModel.findByIdAndUpdate(
      id,
      {
        $set: rest,
      },
      { new: true, runValidators: true }
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
  const { id } = req.params;

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
