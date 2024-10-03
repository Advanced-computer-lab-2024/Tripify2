const express = require("express");
const router = express.Router();

const {
  addPlace,
  getPlacesTourismGovernor,
  getPlacesTourist,
  updatePlace,
  deletePlace,
  getPlace,
} = require("../controllers/placeController");

router.route("/").get(getPlacesTourist).delete(deletePlace).post(addPlace);
router.route("/:id").get(getPlace).patch(updatePlace);
router.get("/touristGovernor", getPlacesTourismGovernor);

module.exports = router;
