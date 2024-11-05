const ItineraryModel = require("../models/Itinerary.js");
const ReviewModel = require("../models/Review.js");
const TourGuideModel = require("../models/Tourguide.js");
const ActivityModel = require("../models/Activity.js");
const Product = require("../models/Product.js");

const addItineraryReview = async (req, res) => {
    const { id } = req.params;
    const { Rating, Review } = req.body;

    console.log(req.body);
    
    try {
        const itinerary = await ItineraryModel.findById(id).populate("Reviews");

        const newRating = (Number(itinerary.Rating) + Rating) / (itinerary.Reviews.filter(review => review.Rating).length + 1);
    
        if (!itinerary) {
            return res.status(400).json({ message: "Itinerary not found" });
        }
    
        const review = {
            UserId: req._id,
            Rating,
            Review,
        };

        const addedReview = await ReviewModel.create(review);
    
        itinerary.Reviews.push(addedReview._id);
        itinerary.Rating = newRating;
        await itinerary.save();
    
        res.status(200).json(itinerary);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

const addTourGuideReview = async (req, res) => {
    const { id } = req.params;
    const { Rating, Review } = req.body;

    try {
        const tourGuide = await TourGuideModel.findById(id).populate("Reviews");

        const newRating = (Number(tourGuide.Rating ?? 0) + Rating) / (tourGuide.Reviews.filter(review => review.Rating).length + 1);
    
        if (!tourGuide) {
            return res.status(400).json({ message: "TourGuide not found" });
        }
    
        const review = {
            UserId: req._id,
            Rating,
            Review,
        };

        const addedReview = await ReviewModel.create(review);
    
        tourGuide.Reviews.push(addedReview._id);
        tourGuide.Rating = newRating;
        await tourGuide.save();
    
        res.status(200).json(tourGuide);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

const addActivityReview = async (req, res) => {
    const { id } = req.params;
    const { Rating, Review } = req.body;

    try {
        const activity = await ActivityModel.findById(id).populate("Reviews");

        const newRating = (Number(activity.Rating) + Rating) / (activity.Reviews.filter(review => review.Rating).length + 1);
    
        if (!activity) {
            return res.status(400).json({ message: "Activity not found" });
        }
    
        const review = {
            UserId: req._id,
            Rating,
            Review,
        };

        const addedReview = await ReviewModel.create(review);
    
        activity.Reviews.push(addedReview._id);
        activity.Rating = newRating;
        await activity.save();
    
        res.status(200).json(activity);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

const addProductReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { Rating, Review } = req.body;

        const product = await Product.findById(id).populate("Reviews");

        const newRating = (Number(product.Rating) + Rating) / (product.Reviews.filter(review => review.Rating).length + 1);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const addedReview = await ReviewModel.create({
            UserId: req._id,
            Review: Review,
            Rating: Rating,
        });

        product.Reviews.push(addedReview._id);
        product.Rating = newRating;
        await product.save();
    
        res.status(200).json(product);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

module.exports = { addItineraryReview, addTourGuideReview, addActivityReview, addProductReview }