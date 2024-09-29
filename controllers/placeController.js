const Places = require("../models/Place");
/////
const TourismGovernor = require("../models/TourismGovernor");
const Tourist = require("../models/Tourist");
/////

const addPlace = async (req, res) => {
  try {
    const thePlaceToAdd = await Places.create(req.body);
    if (!thePlaceToAdd)
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
  const { myPlaces, specificPlace, Name, Tags } = req.query;
  const query = {};
  try {
    if (specificPlace) {
      if (Name) query.Name = Name;
      if (Tags) {
        const putTagsInArray = Tags.split(",").map((eachTag) => eachTag.trim());
        query.Tags = { $in: putTagsInArray };
      }

      const places = await Places.find(query);
      if (!places || !places.length)
        return res.status(400).json({
          message: "No places match the given name/tag(s)",
        });
      return res.status(200).json(places);
    } else if (myPlaces) {
      const tourismGovernor = await TourismGovernor.findById(tourismGovernorId);

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
  const { Filter, Upcoming, Name, Tags } = req.query;
  const query = {};
  try {
    if (Filter) {
      //Tourist / Guest should be able to filter places by tags
      if (Tags) {
        const putTagsInArray = Tags.split(",").map((eachTag) => eachTag.trim());
        query.Tags = { $in: putTagsInArray };
      }

      const places = await Places.find(query);
      if (!places || !places.length)
        return res.status(400).json({
          message: "No places match the tag(s)",
        });
      return res.status(200).json(places);
    } else if (Upcoming) {
      //Tourist / Guest view upcoming places==> what is the middleware to check for a guest? wala mafeesh
      const tourist = await Tourist.findById(touristId);
      const upcomingPlacesTourist = { $in: tourist.UpcomingPlaces }; //!!!!!add attribute UpcomingPlaces to tourist schema!!!!!
      query.Name = upcomingPlacesTourist;

      const places = await Places.find(query);
      if (!places)
        return res.status(400).json({ message: "No upcoming places!" });
      return res.status(200).json(places);
    } else if (Name || Tags) {
      //Tourist can search for a SPECIFIC place by (name or tag) (ana amelha yenfa3 tefilter bel etnain aw wahda menhom)
      if (Name) query.Name = Name; //akhaleeha case-insensitive? regrex
      if (Tags) {
        const putTagsInArray = Tags.split(",").map((eachTag) => eachTag.trim());
        query.Tags = { $in: putTagsInArray };
      }

      const places = await Places.find(query);
      if (!places || !places.length)
        return res.status(400).json({
          message: "No places match the given name/tag(s)",
        });
      return res.status(200).json(places);
    } else {
      //all places
      try {
        const places = await Places.find({});
        if (!places)
          return res.status(400).json({ message: "No places available" });
        return res.status(200).json(places);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
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
