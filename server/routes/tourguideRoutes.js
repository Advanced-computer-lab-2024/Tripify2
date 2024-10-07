const express = require("express");
const router = express.Router();
const {
  createTourguideProfile,
  getTourguideProfile,
  updateTourguideProfile,
  allTourguides,
  getTourguideItineraries,
  deleteTourguide,
  acceptTourGuide,
  rejectTourGuide,
} = require("../controllers/tourguideController");
const verifyTourGuide = require('../middleware/verifyTourGuide')
const verifyAdmin = require('../middleware/verifyAdminOnly')

router.route("/").post(createTourguideProfile).get(allTourguides);

router
  .route("/:id")
  .get(getTourguideProfile)
  .patch(verifyTourGuide, updateTourguideProfile)
  .delete(verifyAdmin, deleteTourguide)

router.route('/get-all/my-itineraries')
      .get(verifyTourGuide, getTourguideItineraries);

router.route('/accept/:id')
      .post(verifyAdmin, acceptTourGuide)

router.route("/reject/:id")
      .post(verifyAdmin, rejectTourGuide);

module.exports = router;
