const express = require("express");
const router = express.Router();
const {
  getAdvertisers,
  createAdvertiser,
  updateAdvertiser,
  deleteAdvertiser,
  getAdvertiserById,
} = require("../controllers/advertiserController");
const verifyAdvertiser = require("../middleware/verifyAdvertiser");

router
  .route("/")
  .get(getAdvertisers)
  .post(createAdvertiser)
  .put(verifyAdvertiser, updateAdvertiser)
  .delete(verifyAdvertiser, deleteAdvertiser);

router.route("/:id").get(getAdvertiserById);

module.exports = router;
