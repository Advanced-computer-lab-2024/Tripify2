const express = require("express");
const router = express.Router();
const verifyTourismGovernor = require("../middleware/verifyTourismGovernor");

const {
  addPlace,
  getPlacesTourismGovernor,
  getPlacesTourist,
  updatePlace,
  deletePlace,
  getPlace,
} = require("../controllers/placeController");

router
  .route("/")
  .get(getPlacesTourist)
  .patch(updatePlace)
  .delete(deletePlace)
  .post(verifyTourismGovernor, addPlace);

//.get(getPlacesTourismGovernor)

module.exports = router;
