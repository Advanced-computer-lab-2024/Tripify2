const express = require("express");
const router = express.Router();
const {
  createTourguideProfile,
  getTourguideProfile,
  updateTourguideProfile,
  allTourguides,
  getTourguideItineraries
} = require("../controllers/tourguideController");
const verifyTourGuide = require('../middleware/verifyTourGuide')

router.route("/").post(createTourguideProfile).get(allTourguides);

router
  .route("/:id")
  .get(getTourguideProfile)
  .patch(/*verifyTourGuide,*/ updateTourguideProfile);

router.route('/get/my-itineraries')
      .get(verifyTourGuide, getTourguideItineraries);

module.exports = router;
