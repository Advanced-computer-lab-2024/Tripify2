const activityModel = require("../models/Activity.js");
const advertiserModel = require("../models/Advertiser.js");
const TagModel = require("../models/Tag");
const CategoryModel = require("../models/Category");
const Advertiser = require("../models/Advertiser.js");
const NotificationService = require('../config/notification.service');
const notificationService = new NotificationService();

const getActivityAdmin = async (req, res) => {
  const activities = await activityModel.find({}).populate({
    path: 'AdvertiserId',
    populate: {
      path: 'UserId',
      select: 'UserName'
    }
  });
  res.status(200).json(activities);
};

const createActivity = async (req, res) => {
  const {
    Name,
    Date: dateString, // Renamed to dateString to avoid conflict
    Time: timeString, // Renamed to timeString
    Location,
    Price,
    Categories,
    Tags,
    SpecialDiscounts,
    AdvertiserId,
    Duration,
    Image,
  } = req.body;

  const advertiser = await advertiserModel.findById(AdvertiserId, "UserId");
  if (!advertiser || advertiser.UserId.toString() !== req._id)
    return res.status(400).json({ message: "Unauthorized Advertiser!" });

  try {
    if (!Tags || Tags.length === 0) {
      return res.status(400).json({ message: "Please provide valid tags" });
    }

    if (!Categories || Categories.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide valid categories" });
    }

    const foundTags = await TagModel.find({ _id: { $in: Tags } });
    const foundCategories = await CategoryModel.find({
      _id: { $in: Categories },
    });

    if (foundTags.length !== Tags.length) {
      return res.status(400).json({ message: "One or more Tags are invalid" });
    }
    if (foundCategories.length !== Categories.length) {
      return res
        .status(400)
        .json({ message: "One or more Categories are invalid" });
    }

    let parsedPrice = typeof Price === "string" ? parseInt(Price, 10) : Price;
    let parsedDiscount =
      typeof SpecialDiscounts === "string"
        ? parseInt(SpecialDiscounts, 10)
        : SpecialDiscounts;

    let parsedDate = new Date(dateString);
    let parsedTime = new Date(timeString);

    // Validate the date and time
    if (isNaN(parsedDate.getTime()) || isNaN(parsedTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    const newActivity = new activityModel({
      Name,
      Date: parsedDate,
      Time: parsedTime,
      Location,
      Price: parsedPrice,
      CategoryId: Categories,
      Tags,
      SpecialDiscounts: parsedDiscount,
      AdvertiserId,
      Duration,
      Image,
    });
    await newActivity.save();

    await Advertiser.findOneAndUpdate(
      { UserId: req._id },
      { $push: { Activities: newActivity } },
      { new: true }
    );

    res.status(201).json({
      message: "Activity created successfully",
      activity: newActivity,
    });
  } catch (error) {
    console.error("Error creating activity:", error); // Log the complete error for debugging
    res
      .status(400)
      .json({ message: "Error creating Activity", Error: error.message });
  }
};

const getActivity = async (req, res) => {
  const { categories, tags } = req.query;

  console.log(categories, tags);

  try {
    if (
      !categories ||
      !tags ||
      categories?.length === 0 ||
      tags?.length === 0
    ) {
      const activity = await activityModel
        .find({})
        .populate("Tags")
        .populate("CategoryId")
        .populate("AdvertiserId");
      res.status(200).json(activity);
    } else {
      const activity = await activityModel
        .find({
          CategoryId: { $in: categories.split("-") },
          Tags: { $in: tags.split("-") },
        })
        .populate("Tags")
        .populate("CategoryId")
        .populate("AdvertiserId");
      res.status(200).json(activity);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Activity", error });
  }
};

const getActivityById = async (req, res) => {
  const { id } = req.params;
  //const { Username, Email, Password, Website, Hotline, Profile, Accepted } = req.body;

  try {
    const findActivity = await activityModel
      .findById(id)
      .populate("Tags")
      .populate("CategoryId")
      .populate({
        path: "AdvertiserId",
        populate: [
          {
            path: "UserId",
            select: "UserName",
          },
          {
            path: "CompanyProfile",
          },
        ],
      });

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

  const advertiser = await advertiserModel.findOne(
    { UserId: req._id },
    "UserId"
  );

  const updatedActivity = await activityModel.findById(id);

  if (
    !updatedActivity ||
    updatedActivity.AdvertiserId.toString() !== advertiser._id.toString()
  )
    return res.status(400).json({ message: "Unauthorized Advertiser!" });

  const {
    Name,
    Date: dateString,
    Time: timeString,
    Location,
    Price,
    SpecialDiscounts,
    Duration,
    Image,
    CategoryId,
    Tags,
  } = req.body;
  try {
    console.log({ CategoryId, Tags });
    let parsedPrice = typeof Price === "string" ? parseInt(Price, 10) : Price;
    let parsedDiscount =
      typeof SpecialDiscounts === "string"
        ? parseInt(SpecialDiscounts, 10)
        : SpecialDiscounts;

    let parsedDate = new Date(dateString);
    let parsedTime = new Date(timeString);
    if (Tags.length == 0) {
      return res.status(400).json({ message: "need to have atleast 1 tag" });
    }
    if (CategoryId.length == 0) {
      return res
        .status(400)
        .json({ message: "need to have atleast 1 Category" });
    }
    if (isNaN(parsedDate.getTime()) || isNaN(parsedTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    const updatedActivity = await activityModel.findByIdAndUpdate(
      id,
      {
        Name: Name,
        Date: parsedDate,
        Time: parsedTime,
        Location: Location,
        Price: parsedPrice,
        SpecialDiscounts: parsedDiscount,
        Duration: Duration,
        Image: Image,
        CategoryId,
        Tags,
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
    console.log("ERRROR", error);
    res.status(400).json({ message: "Error updating activity", error });
  }
};

const deleteActivity = async (req, res) => {
  const { id } = req.params;

  const advertiser = await advertiserModel.findOne(
    { UserId: req._id },
    "UserId"
  );

  const deletedActivity = await activityModel.findById(id);

  if (
    !deletedActivity ||
    deletedActivity.AdvertiserId.toString() !== advertiser._id.toString()
  )
    return res.status(400).json({ message: "Unauthorized Advertiser!" });

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

const flagActivity = async (req, res) => {
  const { id } = req.params;


  try {
    const activity = await activityModel.findById(id)
    activity.Inappropriate = !activity.Inappropriate

    await activity.save()

    if (activity.Inappropriate) {
      const advertiser = await advertiserModel.findById(activity.AdvertiserId, "UserId").populate("UserId");
      console.log(advertiser)

      await Promise.all([
        notificationService.createNotification({
          Message: "The Activity ''" + activity.Name + "'' has been flagged as inappropriate",
          TargetRoute: '/my-activities/' + id,
          Type: 'error',
          UserId: advertiser.UserId._id.toString()
        }),
        notificationService.sendEmail({
          recipientEmail: advertiser.UserId.Email,
          subject: "Tripify: Inappropriate Activity Flagged",
          content: "The Activity '" + activity.Name + "' has been flagged as inappropriate"
        })
      ])
    }
    // const activity = await ActivityModel.findByIdAndUpdate(id, { Inappropriate: true }, { new: true });

    if (!activity) return res.status(404).json({ msg: `Cannot find any Activity with id ${id}` });
    return res.status(200).json("Activity flagged successfully");
  }
  catch (e) {
    res.status(400).json({ msg: "Operation Failed" });
  }
}
// const deletAll = async (req, res) => {
//   try {
//     await activityModel.deleteMany({});
//     res.status(200).json("yess");
//   } catch {
//     res.status(500).json("noo");
//   }
// };
// const getActivityByAdvertiserId = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const activities = await activityModel.find({ AdvertiserId: id });

//     if (!activities || activities.length == 0) {
//       return res.status(400).json("No activity found for this advertiser");
//     }
//     res
//       .status(200)
//       .json({ message: "Activities found", activities: activities });
//   } catch (error) {
//     res.status(400).json({ Error: error.message });
//   }
// };

module.exports = {
  // deletAll,
  // getActivityByAdvertiserId,
  createActivity,
  getActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivityAdmin,
  flagActivity
};
