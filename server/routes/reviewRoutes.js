const express = require("express");

const router = express.Router();
const itinerariesRouter = express.Router();
const tourGuidesRouter = express.Router();
const activitiesRouter = express.Router();
const productRouter = express.Router();

const { addItineraryReview, addTourGuideReview, addActivityReview, addProductReview } = require("../controllers/reviewController");

const verifyTourist = require("../middleware/verifyTouristOnly");

// itineraries routes
itinerariesRouter.post("/:id", verifyTourist, addItineraryReview);

// tourGuides routes
tourGuidesRouter.post("/:id", verifyTourist, addTourGuideReview);

// activities routes
activitiesRouter.post("/:id", verifyTourist, addActivityReview);

// product routes
productRouter.post("/:id", verifyTourist, addProductReview);

router.use("/itineraries", itinerariesRouter);
router.use("/tourguides", tourGuidesRouter);
router.use("/activities", activitiesRouter);
router.use("/products", productRouter);

module.exports = router;