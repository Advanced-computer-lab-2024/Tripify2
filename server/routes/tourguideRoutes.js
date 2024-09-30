const express = require("express");
const router = express.Router();
const {
  createTourguideProfile,
  getTourguideProfile,
  updateTourguideProfile,
  allTourguides,
  deleteTourguide
} = require("../controllers/tourguideController");
//const verifyTourGuide = require('../middleware/verifyTourGuide')

router.route("/")
  .post(createTourguideProfile)
  .get(allTourguides);

router
  .route("/:id")
  .get(getTourguideProfile)
  .patch(/*verifyTourGuide,*/ updateTourguideProfile)
  .delete(deleteTourguide)

module.exports = router;
