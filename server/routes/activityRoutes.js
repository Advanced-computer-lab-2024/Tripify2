const express = require("express");
const router = express.Router();
const {
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
  getActivityByAdvertiserId,
} = require("../controllers/activityController");
//const verifyAdvertiser = require("../middleware/verifyAdvertiser");

router.route("/").get(getActivity).post(/*verifyAdvertiser,*/ createActivity);

router
  .route("/:id")
  .get(getActivityById)
  .delete(deleteActivity)
  .patch(updateActivity);

router.route("/MyActivities/:id").get(getActivityByAdvertiserId);
module.exports = router;
