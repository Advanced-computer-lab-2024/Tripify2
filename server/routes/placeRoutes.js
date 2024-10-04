const express = require("express");
const router = express.Router();

const {
  addPlace,
  getPlacesTourismGovernor,
  getPlacesTourist,
  updatePlace,
  deletePlace,
} = require("../controllers/placeController");

const verifyTourismGovernor = require('../middleware/verifyTourismGovernor')

//Valid Tourism Governor check
const tourismGovernorCheck = async (req, res, next) => {
  try {
    const { tourismGovernorId } = req.body;
    const tourismGovernor = await TourismGovernor.findById(tourismGovernorId);
    if (!tourismGovernor)
      return res.status(400).json({
        message: `No Tourism Governor with the ID ${tourismGovernorId} exists!`,
      });
    req.tourismGovernorId = tourismGovernorId;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Valid Tourist check
const touristCheck = async (req, res, next) => {
  try {
    const { touristId } = req.body;
    const tourist = await Tourist.findById(touristId);
    if (!tourist)
      return res
        .status(400)
        .json({ message: `No Tourist with the ID ${touristId} exists` });
    req.touristId = touristId;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

router
  .route("/")
  .get(getPlacesTourismGovernor)
  .get(getPlacesTourist)
  .patch(updatePlace)
  .delete(deletePlace)
  .post(verifyTourismGovernor, addPlace);

// router.post("/add" /*, tourismGovernorCheck*/, addPlace);
// router.delete("/remove" /*, tourismGovernorCheck*/, deletePlace);
// router.patch("/update" /*, tourismGovernorCheck*/, updatePlace);
// router.get("/" /*, tourismGovernorCheck*/, getPlacesTourismGovernor);
// router.get(/*"/touristCheck"*/ "/" /*, touristCheck*/, getPlacesTourist);

module.exports = router;
