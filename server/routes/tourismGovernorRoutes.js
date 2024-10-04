const express = require("express");
const router = express.Router();

const {
  addTourismgovernor,
  getTourismgovernor,
  getPlacesTourismGoverner,
} = require("../controllers/tourismgovernorController");



router.route("/").post(addTourismgovernor).get(getTourismgovernor);
router.route("/myPlaces").get(getPlacesTourismGoverner)

// router.post("/add", addTourismgovernor);
// router.get("/", getTourismgovernor);

module.exports = router;
