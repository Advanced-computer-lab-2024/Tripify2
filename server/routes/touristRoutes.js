const express = require("express");
const router = express.Router();
const {
  createTourist,
  getTourists,
  getTourist,
  updateTourist,
  deleteTourist,
} = require("../controllers/touristController.js");

router.route("/").get(getTourists).post(createTourist);
router.route("/:id").get(getTourist).patch(updateTourist).delete(deleteTourist);

module.exports = router;
