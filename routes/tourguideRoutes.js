const express = require('express')
const router=express.Router();
const {createTourguideProfile, getTourguideProfile, updateTourguideProfile}= require('../controllers/tourguideController')
const verifyTourGuide = require('../middleware/verifyTourGuide')

router.route('/')
    .post(createTourguideProfile)

router.route('/:id')
    .get(getTourguideProfile)
    .patch(verifyTourGuide, updateTourguideProfile)

module.exports=router;
