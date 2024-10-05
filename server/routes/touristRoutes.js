const express = require("express");
const router = express.Router();
const {
  createTourist,
  getTourists,
  getTourist,
  updateTourist,
  deleteTourist,
} = require("../controllers/touristController.js");

const verifyTourist = require("../middleware/verifyJWT.js")

router.route("/").get(getTourists).post(createTourist);
router.route("/:id").get(getTourist).patch(verifyTourist, updateTourist).delete(verifyTourist, deleteTourist);

module.exports = router;
