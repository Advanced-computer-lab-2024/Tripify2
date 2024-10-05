const express = require("express");
const router = express.Router();
const verifyTourismGovernor = require("../middleware/verifyTourismGovernor");

const {
  addPlace,
  getPlacesTourist,
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

// router.post("/add" /*, tourismGovernorCheck*/, addPlace);
// router.delete("/remove" /*, tourismGovernorCheck*/, deletePlace);
// router.patch("/update" /*, tourismGovernorCheck*/, updatePlace);
// router.get("/" /*, tourismGovernorCheck*/, getPlacesTourismGovernor);
// router.get(/*"/touristCheck"*/ "/" /*, touristCheck*/, getPlacesTourist);

module.exports = router;
