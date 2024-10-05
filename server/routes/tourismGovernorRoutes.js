const express = require("express");
const router = express.Router();

const {
  addTourismgovernor,
  getTourismgovernor,
  getTourismGovernorPlaces
} = require("../controllers/tourismgovernorController");

const verifyTourismGovernor = require('../middleware/verifyTourismGovernor')
const verifyAdmin = require('../middleware/verifyAdminOnly')

router.route('/').post(verifyAdmin, addTourismgovernor).get(getTourismgovernor);

router.route('/my-places').get(verifyTourismGovernor, getTourismGovernorPlaces);
router.route('/my-tags').get(verifyTourismGovernor, getTourismGovernorPlaces);

// router.post("/add", addTourismgovernor);
// router.get("/", getTourismgovernor);

module.exports = router;
