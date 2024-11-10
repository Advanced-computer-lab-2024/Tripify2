const express = require("express");
const router = express.Router();
const {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  getMyItineraries,
  flagItinerary,
  // createItineraryBooking,
  // acceptItineraryBooking
} = require("../controllers/itineraryController");

// const bodyParser = require('body-parser');

const verifyTourGuide = require("../middleware/verifyTourGuide");
const verifyAdmin = require("../middleware/verifyAdminOnly");
// const verifyTourist = require("../middleware/verifyTouristOnly");

router.route("/").get(getItineraries).post(verifyTourGuide, createItinerary);

router
  .route("/:id")
  .get(getItinerary)
  .patch(verifyTourGuide, updateItinerary)
  .delete(verifyTourGuide, deleteItinerary);

router.route('/get-all/my-itineraries').get(verifyTourGuide, getMyItineraries);

router.route('/flag/:id').patch(verifyAdmin, flagItinerary);

// router.route('/create-booking/:id').get(verifyTourist, createItineraryBooking);
// router.route('/callback/booking', bodyParser.raw({type: 'application/json'})).post(acceptItineraryBooking);

module.exports = router;
