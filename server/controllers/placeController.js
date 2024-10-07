const Places = require("../models/Place");
/////
const TourismGovernorModel = require("../models/TourismGovernor");
const TagModel = require("../models/Tag");
const CategoryModel = require("../models/Category");
const TourismGovernor = require("../models/TourismGovernor");
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
    TourismGovernor,
  } = req.body;

  if (
    !Name ||
    !Type ||
    !Description ||
    !Location ||
    !Pictures ||
    !OpeningHours ||
    !TicketPrices ||
    !TourismGovernor
  )
    return res.status(400).json({ message: "All Fields Must Be Given!" });

  console.log(req.body);

  const tourismGovernor = await TourismGovernorModel.findById(
    TourismGovernor,
    "UserId"
  );
  if (!tourismGovernor || tourismGovernor?.UserId?.toString() !== req._id)
    return res.status(400).json({ message: "Unauthorized TourismGovernor!" });

  try {
    const { Tags, Categories } = req.body;
    console.log(req.body);
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

    console.log(foundTags);
    console.log(foundCategories);

    if (foundTags.length !== Tags.length) {
      return res.status(400).json({ message: "One or more Tags are invalid" });
    }
    if (foundCategories.length !== Categories.length) {
      return res
        .status(400)
        .json({ message: "One or more Categories are invalid" });
    }

    const thePlaceToAdd = await Places.create(req.body).catch((err) =>
      console.log(err)
    );
    const updatedTourismGovernor = await TourismGovernorModel.findByIdAndUpdate(
      TourismGovernor,
      { $push: { AddedPlaces: thePlaceToAdd._id } }
    ).catch((err) => console.log(err));
    if (!thePlaceToAdd || !updatedTourismGovernor)
      return res.status(400).json({ message: "Please enter a valid place" });

    //add Name to tourismgovernor table in AddedPlaces attribute
    return res.status(200).json("The place has been added!");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/*
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
*/
const getPlace = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const place = await Places.findById(id)
      .populate("Tags", "Tag")
      .populate("Categories", "Category");
    if (!place) return res.status(404).json({ msg: "Place not found" });
    return res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tourist", error });
  }
};

const getPlaces = async (req, res) => {
  try {
    const places = await Places.find().lean().exec();
    if (!places)
      return res.status(400).json({
        message: "No places match the given name/tag(s)",
      });
    return res.status(200).json(places);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const getPlacesTourist = async (req, res) => {
//   const touristId = req.touristId;
//   //const touristId = "66f70743960a336771bca977";

//   try {
//     const places = await Places.find({});
//     if (!places)
//       return res.status(400).json({
//         message: "No places match the given name/tag(s)",
//       });
//     return res.status(200).json(places);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const updatePlace = async (req, res) => {
  const { id } = req.params;
  const { Name, ...rest } = req.body;

  console.log(req.body)

  const toursimGovernor = await TourismGovernor.findOne(
    { UserId: req._id },
    "UserId"
  );

  const updatedPlace = await Places.findById(id);

  if (
    !updatedPlace ||
    updatedPlace?.TourismGovernor?.toString() !==
      toursimGovernor?._id?.toString()
  )
    return res.status(400).json({ message: "Unauthorized ToursimGovernor!" });

  try {
    //findOneAndUpdate takes objects
    // rest.Categories = rest.Categories.map((category) => category._id);
    // rest.Tags = rest.Tags.map((tag) => tag._id);

    const placeToUpdate = await Places.findByIdAndUpdate(
      id,
      { ...rest },
      { new: true } //runValidators runs all the schema validations that need to be met
    ).catch((err) => console.log(err));
    console.log("placeToUpdate: ", placeToUpdate);
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
  const { id } = req.params;

  const tourismGovernor = await TourismGovernor.findOne(
    { UserId: req._id },
    "UserId"
  );

  const deletedPlace = await Places.findById(id);

  if (
    !deletedPlace ||
    deletedPlace.TourismGovernor.toString() !== tourismGovernor._id.toString()
  )
    return res.status(400).json({ message: "Unauthorized TourismGovernor!" });

  try {
    const placeToDelete = await Places.findByIdAndDelete(id);
    if (!placeToDelete)
      return res
        .status(400)
        .json({ message: `The place with id ${id} was not found!` });

    //remove Name from tourismgovernor table in AddedPlaces attribute
    return res
      .status(200)
      .json({ message: `The place with id ${id} was deleted!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPlace,
  updatePlace,
  deletePlace,
  /*getPlacesTourismGovernor,*/
  // getPlacesTourist,
  getPlace,
  getPlaces,
};
