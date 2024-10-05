const TourismGovernor = require("../models/TourismGovernor");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const addTourismgovernor = async (req, res) => {
  const { UserName, Email, Password } = req.body;

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

    const tourismGovernor = await TourismGovernor.create({ AddedPlaces: [], UserId: newUser._id });
    if (!tourismGovernor)
      return res.status(400).json({
        message: "Error occured while trying to add a new Tourism Governor",
      });
    return res
      .status(200)
      .json({ message: "Tourism Governor added successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTourismgovernor = async (req, res) => {
  try {
    const tourismGovernors = await TourismGovernor.find({});
    if (!tourismGovernors)
      return res
        .status(400)
        .json({ message: "No Tourism Governors where found!" });
    return res.status(200).json(tourismGovernors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTourismGovernorPlaces = async (req, res) => {
  if(!req._id) return res.status(400).json({'message': 'Unauthorized TourismGovernor!'})

  try 
  {
    const places = await TourismGovernor.findOne({ UserId: req._id }, "AddedPlaces").lean().populate("AddedPlaces");
    if (!places) return res.status(400).json({ message: "No Places where found!" });
    return res.status(200).json(places);
  } 
  catch (error) 
  {
    return res.status(500).json({ message: error.message });
  }
}

const getTourismGovernorTags = async (req, res) => {
  if(!req._id) return res.status(400).json({'message': 'Unauthorized TourismGovernor!'})

  try 
  {
    const tags = await TourismGovernor.findOne({ UserId: req._id }, "AddedTags").lean().populate("AddedTags");
    if (!tags) return res.status(400).json({ message: "No Tags where found!" });
    return res.status(200).json(tags);
  } 
  catch (error) 
  {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { addTourismgovernor, getTourismgovernor, getTourismGovernorPlaces, getTourismGovernorTags };
