const express = require("express");
const router = express.Router();

const {
  getFlight,
  getFlights
} = require("../controllers/flightController");

const verifyJWT = require("../middleware/verifyJWT");

router.route("/")
    .get(verifyJWT, getFlights)
  
router.route('/:id')
    .get(verifyJWT, getFlight)


//.get(getFlightsTourismGovernor)

module.exports = router;
