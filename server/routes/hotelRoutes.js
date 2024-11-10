const express = require("express");
const router = express.Router();

const {
  getHotel,
  getHotels
} = require("../controllers/hotelController");

const verifyJWT = require("../middleware/verifyJWT");

router.route("/")
    .get(verifyJWT, getHotels)
  
router.route('/:id')
    .get(verifyJWT, getHotel)


//.get(getHotelsTourismGovernor)

module.exports = router;
