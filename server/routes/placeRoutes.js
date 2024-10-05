const express = require("express");
const router = express.Router();
const verifyTourismGovernor = require("../middleware/verifyTourismGovernor");

const {
  addPlace,
  updatePlace,
  deletePlace,
  getPlace,
  getPlaces
} = require("../controllers/placeController");

router
  .route("/")
  .get(getPlaces)
  .post(verifyTourismGovernor, addPlace);
  
router
  .route('/:id')
  .get(getPlace)
  .patch(verifyTourismGovernor, updatePlace)
  .delete(verifyTourismGovernor, deletePlace)

//.get(getPlacesTourismGovernor)

module.exports = router;
