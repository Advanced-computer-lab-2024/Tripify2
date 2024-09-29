const express = require('express')
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')

const verifySeller = require('../middleware/verifySeller')

router.route('/')
    .get(getProducts)
    .post(verifySeller, createProduct)

router.route('/:id')
    .get(getProductById)
    .patch(verifySeller, updateProduct)
    .delete(verifySeller, deleteProduct)

module.exports = router;