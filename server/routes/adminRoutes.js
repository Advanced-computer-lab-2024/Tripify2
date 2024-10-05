const express = require('express')
const router=express.Router();
const verifyAdmin = require('../middleware/verifyAdminOnly')

const { createAdmin, getAdmins, getAdmin, getAdminProducts } = require("../controllers/adminController");

router.route('/')
    .post(createAdmin)
    .get(getAdmins)

router.route('/:id')
    .get(getAdmin)

router.route('/get-all/my-products')
    .get(getAdminProducts)

module.exports = router;