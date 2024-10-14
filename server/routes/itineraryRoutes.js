const express = require("express");
const router = express.Router();
const {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  getMyItineraries
} = require("../controllers/itineraryController");

const verifyTourGuide = require("../middleware/verifyTourGuide");

router.route("/").get(getItineraries).post(verifyTourGuide, createItinerary);

router
  .route("/:id")
  .get(getItinerary)
  .patch(verifyTourGuide, updateItinerary)
  .delete(verifyTourGuide, deleteItinerary);

router.route('/get-all/my-itineraries').get(verifyTourGuide, getMyItineraries);

module.exports = router;
