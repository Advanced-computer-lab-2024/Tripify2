const express = require("express");

const router = express.Router();
const itinerariesRouter = express.Router();
const activitiesRouter = express.Router();
const productRouter = express.Router();
const flightRouter = express.Router();
const hotelRouter = express.Router();
const transportationRouter = express.Router();

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
  createTransportationBooking,
  getMyTransportationBookings,
  createProductBookingCart,
  deleteAllProductBookings,
  getMyCurrentProductBookings,
  cancelOrderProductBooking,
  updateQuantityProductAndStatus,
  getallItineraryBookings,
  getallActivityBookings,
  getItineraryBookingsById,
  getActivityBookingsById,
  getItineraryBookingsByIdAndDate,
  allItinerariesBookedForTourguide,
  allActivitiesBookedForAdvertiser,
  allBoughtProductsForThisSeller,
  getAllActivityBookings,
} = require("../controllers/bookingController");

const bodyParser = require("body-parser");

const verifyTourist = require("../middleware/verifyTouristOnly");

//itineraries routes
itinerariesRouter.post(
  "/create-booking/:id",
  verifyTourist,
  createItineraryBooking
);
itinerariesRouter.get("", verifyTourist, getMyItineraryBookings);
itinerariesRouter.get("/:id", verifyTourist, getSingleItineraryBooking);
itinerariesRouter.post(
  "/cancel-booking/:id",
  verifyTourist,
  cancelItineraryBooking
);

//activities routes
activitiesRouter.post(
  "/create-booking/:id",
  verifyTourist,
  createActivityBooking
);
activitiesRouter.get("", verifyTourist, getMyActivityBookings);
activitiesRouter.get("/:id", verifyTourist, getSingleActivityBooking);
activitiesRouter.post(
  "/cancel-booking/:id",
  verifyTourist,
  cancelActivityBooking
);

//product routes
productRouter.post("/create-booking/:id", verifyTourist, createProductBooking);
productRouter.post("/create-booking", verifyTourist, createProductBookingCart);
productRouter.get("", /*verifyTourist,*/ getMyProductBookings);
productRouter.get("/current", /*verifyTourist, */ getMyCurrentProductBookings);
productRouter.delete("/:id", deleteAllProductBookings);
productRouter.patch("/", /*verifyTourist, */ cancelOrderProductBooking);
productRouter.patch(
  "/updateQuantityAndStatus",
  /*verifyTourist, */ updateQuantityProductAndStatus
);

//flight routes
flightRouter.post("/create-booking/:id", verifyTourist, createFlightBooking);
flightRouter.get("", verifyTourist, getMyFlightBookings);

//hotel routes
hotelRouter.post("/create-booking/:id", verifyTourist, createHotelBooking);
hotelRouter.get("", verifyTourist, getMyHotelBookings);

//transportation routes
transportationRouter.post(
  "/create-booking/:id",
  verifyTourist,
  createTransportationBooking
);
transportationRouter.get("", verifyTourist, getMyTransportationBookings);

router.use("/itineraries", itinerariesRouter);
router.use("/activities", activitiesRouter);
router.use("/products", productRouter);
router.use("/flights", flightRouter);
router.use("/hotels", hotelRouter);
router.use("/transportations", transportationRouter);

router.post(
  "/callback",
  bodyParser.raw({ type: "application/json" }),
  acceptBooking
);
router.route("/itin").get(getallItineraryBookings);
router.route("/activ").get(getAllActivityBookings);
router.route("/act").get(getallActivityBookings);
router.route("/act/:id").get(getActivityBookingsById);
router.route("/itin/:id").get(getItineraryBookingsById);
router
  .route("/itin/:id/created-at/:createdAt")
  .get(getItineraryBookingsByIdAndDate);
router
  .route("/all-itineraries/booked-tourguide/:id")
  .get(allItinerariesBookedForTourguide);

router.route("/products/for/seller/:id").get(allBoughtProductsForThisSeller);
router
  .route("/activities-booked-for/:id")
  .get(allActivitiesBookedForAdvertiser);
module.exports = router;
