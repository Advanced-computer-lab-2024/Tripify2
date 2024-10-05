const express = require("express");
const router = express.Router();
const {
  getAdvertisers,
  createAdvertiser,
  updateAdvertiser,
  deleteAdvertiser,
  getAdvertiserById,
  getAdvertiserActivities,
  acceptAdvertiser,
} = require("../controllers/advertiserController");
const verifyAdvertiser = require("../middleware/verifyAdvertiser");
const verifyAdmin = require("../middleware/verifyAdminOnly");

router.route("/").get(getAdvertisers).post(createAdvertiser);

router
  .route("/:id")
  .get(getAdvertiserById)
  .patch(verifyAdvertiser, updateAdvertiser)
  .delete(verifyAdmin, deleteAdvertiser);

router
  .route("/get-all/my-activities")
  .get(verifyAdvertiser, getAdvertiserActivities);

router.route("/accept/:id").post(verifyAdmin, acceptAdvertiser);

module.exports = router;
