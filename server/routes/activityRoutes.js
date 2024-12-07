const express = require("express");
const router = express.Router();
const {
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
  getActivityByAdvertiserId,
  getActivityAdmin,
  flagActivity,
} = require("../controllers/activityController");
const verifyAdvertiser = require("../middleware/verifyAdvertiser");
const verifyAdmin = require("../middleware/verifyAdminOnly");

router.route("/get-all").get(getActivityAdmin);
router.route("/").get(getActivity).post(verifyAdvertiser, createActivity);

router.route("/flag/:id").patch(verifyAdmin, flagActivity);

router
  .route("/:id")
  .get(getActivityById)
  .delete(verifyAdvertiser, deleteActivity)
  .patch(verifyAdvertiser, updateActivity);

module.exports = router;
