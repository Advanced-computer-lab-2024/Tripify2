const express = require('express')
const router=express.Router();
const verifyAdmin = require('../middleware/verifyAdminOnly')

const { createAdmin, getAdmins, getAdmin, getAdminProducts } = require("../controllers/adminController");

router.route('/')
    .post(verifyAdmin, createAdmin)
    .get(verifyAdmin, getAdmins)

router.route('/:id')
    .get(verifyAdmin, getAdmin)

router.route('/get-all/my-products')
    .get(verifyAdmin, getAdminProducts)

module.exports = router;