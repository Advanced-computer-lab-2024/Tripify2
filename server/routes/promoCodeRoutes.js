const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdminOnly");
const verifyJWT = require("../middleware/verifyJWT");

const {
    createPromoCode,
    getAllPromoCodes,
    validatePromoCode,
    deletePromoCode,
    updatePromoCode,
    getPromoCodeById
} = require("../controllers/promoCodeController");

router.post("/", verifyAdmin, createPromoCode);
router.get("/all", verifyAdmin, getAllPromoCodes);
router.delete("/:id", verifyAdmin, deletePromoCode);
router.patch("/:id", verifyAdmin, updatePromoCode);

router.post("/validate", verifyJWT, validatePromoCode);
router.get("/:id", verifyJWT, getPromoCodeById);

module.exports = router;