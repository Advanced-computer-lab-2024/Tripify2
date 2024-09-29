const TourismGovernor = require("../models/TourismGovernor");

const addTourismgovernor = async (req, res) => {
  try {
    const tourismGovernor = await TourismGovernor.create(req.body);
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

module.exports = { addTourismgovernor, getTourismgovernor };
