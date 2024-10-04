const Places = require("../models/Place");
/////
const TourismGovernorModel = require("../models/TourismGovernor");
const Tourist = require("../models/Tourist");
/////

const addPlace = async (req, res) => {
  const { 
  Name,
  Type,
  Description,
  Location,
  Pictures,
  OpeningHours,
  TicketPrices,
  TourismGovernor } = req.body

  if(!Name || !Type || !Description || !Location || !Pictures || !OpeningHours || !TicketPrices || !TourismGovernor) return res.status(400).json({'message': 'All Fields Must Be Given!'})

  const tourismGovernor = await TourismGovernorModel.findById(TourismGovernor, "UserId")
  if(!tourismGovernor || (tourismGovernor.UserId.toString() !== req._id)) return res.status(400).json({'message': 'Unauthorized TourismGovernor!'})
  
  try {
    const thePlaceToAdd = await Places.create(req.body);
    const updatedTourismGovernor = await TourismGovernorModel.findByIdAndUpdate(TourismGovernor, {$push: {AddedPlaces: thePlaceToAdd._id}});
    if (!thePlaceToAdd || !updatedTourismGovernor)
      return res.status(400).json({ message: "Please enter a valid place" });

    //add Name to tourismgovernor table in AddedPlaces attribute
    return res.status(200).json("The place has been added!");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPlacesTourismGovernor = async (req, res) => {
  const tourismGovernorId = req.tourismGovernorId;
  //const tourismGovernorId= "66f6f9e8fc38c76b12147e66"
  const { myPlaces } = req.query;
  try {
    if (myPlaces) {
      const tourismGovernor = await TourismGovernorModel.findById(tourismGovernorId);

      const nameOfPlaces = tourismGovernor.AddedPlaces;
      if (!nameOfPlaces || !nameOfPlaces.length)
        return res.status(400).json({ message: "You have added no places!" });
      const allPlaces = await Places.find({ Name: { $in: nameOfPlaces } });
      return res.status(200).json(allPlaces);
    } else {
      const places = await Places.find({});
      if (!places)
        return res.status(400).json({ message: "No places where found!" });
      return res.status(200).json(places);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPlacesTourist = async (req, res) => {
  const touristId = req.touristId;
  //const touristId = "66f70743960a336771bca977";

  try {
    const places = await Places.find({});
    if (!places)
      return res.status(400).json({
        message: "No places match the given name/tag(s)",
      });
    return res.status(200).json(places);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePlace = async (req, res) => {
  const { Name, ...rest } = req.body;
  try {
    //findOneAndUpdate takes objects
    const placeToUpdate = await Places.findOneAndUpdate(
      { Name: Name },
      { $set: rest },
      { new: true, runValidators: true } //runValidators runs all the schema validations that need to be met
    );
    if (!placeToUpdate)
      return res
        .status(400)
        .json({ message: `The place with name ${Name} was not found!` });
    return res.status(200).json(placeToUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePlace = async (req, res) => {
  const { Name } = req.body;
  try {
    //findOneAndDelete takes objects
    const placeToDelete = await Places.findOneAndDelete({ Name: Name });
    if (!placeToDelete)
      return res
        .status(400)
        .json({ message: `The place with name ${Name} was not found!` });

    //remove Name from tourismgovernor table in AddedPlaces attribute
    return res
      .status(200)
      .json({ message: `The place with name ${Name} was deleted!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPlace,
  updatePlace,
  deletePlace,
  getPlacesTourismGovernor,
  getPlacesTourist,
};
