const express = require("express");

const router = express.Router();
const itinerariesRouter = express.Router();
const activitiesRouter = express.Router();
const productRouter = express.Router();
const flightRouter = express.Router();
const hotelRouter = express.Router();

const {
  createItineraryBooking,
  acceptBooking,
  getMyItineraryBookings,
  getSingleItineraryBooking,
  createActivityBooking,
  getMyActivityBookings,
  getSingleActivityBooking,
  cancelActivityBooking,
  cancelItineraryBooking,
  createProductBooking,
  getMyProductBookings,
  createFlightBooking,
  getMyFlightBookings,
  createHotelBooking,
  getMyHotelBookings,
} = require("../controllers/bookingController");

const bodyParser = require('body-parser');

const verifyTourist = require("../middleware/verifyTouristOnly");

//itineraries routes
itinerariesRouter.post("/create-booking/:id", verifyTourist, createItineraryBooking);
itinerariesRouter.get("", verifyTourist, getMyItineraryBookings);
itinerariesRouter.get("/:id", verifyTourist, getSingleItineraryBooking);
itinerariesRouter.post("/cancel-booking/:id", verifyTourist, cancelItineraryBooking);

//activities routes
activitiesRouter.post("/create-booking/:id", verifyTourist, createActivityBooking);
activitiesRouter.get("", verifyTourist, getMyActivityBookings);
activitiesRouter.get("/:id", verifyTourist, getSingleActivityBooking);
activitiesRouter.post("/cancel-booking/:id", verifyTourist, cancelActivityBooking);

//product routes
productRouter.post("/create-booking/:id", verifyTourist, createProductBooking);
productRouter.get("", verifyTourist, getMyProductBookings);

//flight routes
flightRouter.post("/create-booking/:id", verifyTourist, createFlightBooking);
flightRouter.get("", verifyTourist, getMyFlightBookings);

//hotel routes
hotelRouter.post("/create-booking/:id", verifyTourist, createHotelBooking);
hotelRouter.get("", verifyTourist, getMyHotelBookings);

router.use("/itineraries", itinerariesRouter);
router.use("/activities", activitiesRouter);
router.use("/products", productRouter);
router.use("/flights", flightRouter);
router.use("/hotels", hotelRouter);

router.post("/callback", bodyParser.raw({type: 'application/json'}), acceptBooking);

module.exports = router;