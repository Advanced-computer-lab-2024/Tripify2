const express = require('express')
const router=express.Router();
const {createSeller, getSeller, getSellers, updateSeller, deleteSeller, acceptSeller, getSellerProducts, rejectSeller, getSellerUser}= require('../controllers/sellerController')

const verifySeller = require('../middleware/verifySeller')
const verifyAdmin = require('../middleware/verifyAdminOnly')

router.route('/')
    .post(createSeller)
    .get(getSellers)
router.route('/:id')
    .get(getSeller)
    .patch(verifySeller, updateSeller)
    .delete(verifyAdmin, deleteSeller)

router.route('/accept/:id')
    .post(verifyAdmin, acceptSeller)

router.route('/reject/:id')
    .post(verifyAdmin, rejectSeller)

router.route('/get-all/my-products')
    .get(verifySeller, getSellerProducts)
router.route('/user/:id')
    .get(getSellerUser)

module.exports=router;
