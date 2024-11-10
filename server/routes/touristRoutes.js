const express = require("express");
const router = express.Router();
const {
  createTourist,
  getTourists,
  getTourist,
  updateTourist,
  deleteTourist,
  redeemPoints,
} = require("../controllers/touristController.js");

const verifyTourist = require("../middleware/verifyJWT.js")
const verifyTouristOnly = require("../middleware/verifyTouristOnly.js")

router.route("/").get(getTourists).post(createTourist);
router.route("/:id").get(getTourist).patch(verifyTourist, updateTourist).delete(verifyTourist, deleteTourist);
router.route("/points/redeem").post(verifyTouristOnly, redeemPoints);

module.exports = router;
