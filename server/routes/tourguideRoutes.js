const express = require("express");
const router = express.Router();
const {
  createTourguideProfile,
  getTourguideProfile,
  updateTourguideProfile,
  allTourguides,
  deleteTourGuide
} = require("../controllers/tourguideController");
//const verifyTourGuide = require('../middleware/verifyTourGuide')

router.route("/")
  .post(createTourguideProfile)
  .get(allTourguides);

router
  .route("/:id")
  .get(getTourguideProfile)
  .patch(/*verifyTourGuide,*/ updateTourguideProfile)
  .delete(deleteTourGuide)

module.exports = router;
