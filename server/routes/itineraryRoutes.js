const express = require('express')
const router=express.Router();
const {createItinerary, getItineraries, getItinerary, updateItinerary, deleteItinerary}= require('../controllers/itineraryController')

const verifyTourGuide = require('../middleware/verifyTourGuide')

router.route('/')
    .get(getItineraries)
    .post(verifyTourGuide, createItinerary)
    
router.route('/:id')
    .get(getItinerary)
    .patch(verifyTourGuide, updateItinerary)
    .delete(verifyTourGuide, deleteItinerary)

module.exports=router;
