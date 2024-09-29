const express = require("express");
const router = express.Router();

const {
  addTourismgovernor,
  getTourismgovernor,
} = require("../controllers/tourismgovernorController");

router.route.post(addTourismgovernor).get(getTourismgovernor);

// router.post("/add", addTourismgovernor);
// router.get("/", getTourismgovernor);

module.exports = router;
