const express = require("express");
const router = express.Router();
const verifyTourismGovernor = require('../middleware/verifyTourismGovernor');

const {
  addPlace,
  getPlacesTourismGovernor,
  getPlacesTourist,
  updatePlace,
  deletePlace,
  getPlace,
} = require("../controllers/placeController");

router.route("/").get(getPlacesTourist).post(addPlace);
router.route("/:id").get(getPlace).patch(updatePlace).delete(deletePlace);
router.get("/tourismGovernor/:id",verifyTourismGovernor, getPlacesTourismGovernor);

module.exports = router;
