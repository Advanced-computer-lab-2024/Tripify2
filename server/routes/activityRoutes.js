const express = require("express");
const router = express.Router();
const {
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
} = require("../controllers/activityController");
// const verifyAdvertiser = require('../middleware/verifyAdvertiser')

router
  .route("/")
  .get(getActivity)
  .post(/*verifyAdvertiser,*/ createActivity)
  .patch(/*verifyAdvertiser, */ updateActivity)
  .delete(/*verifyAdvertiser, */ deleteActivity);

router.route("/:id").get(getActivityById);

module.exports = router;
