const express = require('express')
const router=express.Router();
const {createSeller, getSeller, getSellers, updateSeller}= require('../controllers/sellerController')

router.route('/')
    .post(createSeller)
    .get(getSellers)
router.route('/:id')
    .get(getSeller)
    .patch(updateSeller)

module.exports=router;
