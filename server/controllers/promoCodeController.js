const PromoCode = require('../models/PromoCode');

const createPromoCode = async (req, res) => {
    try {
        if (!req.body.Value) return res.status(400).json({ message: "Please enter a value" });
        console.log(req.body);
        const promoCode = await PromoCode.create({ ...req.body, Value: parseFloat(req.body.Value) }).catch(err => console.log(err));
        return res.status(200).json(promoCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const validatePromoCode = async (req, res) => {
    try {
        const { code, amount } = req.body;
        const promoCode = await PromoCode.findOne({ Code: code.toUpperCase() });

        if (!promoCode) {
            return res.status(404).json({ message: "Promo code not found" });
        }

        if (!promoCode.isUserEligible(req._id)) {
            return res.status(400).json({ message: "You are not eligible to use this promo code" });
        }

        const discount = promoCode.calculateDiscount(amount);

        res.status(200).json({
            discount,
            type: promoCode.Type,
            value: promoCode.Value
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find().populate('EligibleUsers', 'UserName');
        res.status(200).json(promoCodes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const promoCode = await PromoCode.findByIdAndDelete(id);

        if (!promoCode) {
            return res.status(404).json({
                message: "Promo code not found"
            });
        }

        res.status(200).json({
            message: "Promo code deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const promoCode = await PromoCode.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!promoCode) {
            return res.status(404).json({
                message: "Promo code not found"
            });
        }

        res.status(200).json(promoCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPromoCodeById = async (req, res) => {
    try {
        const { id } = req.params;
        const promoCode = await PromoCode.findById(id)
            .populate('EligibleUsers', 'UserName');

        if (!promoCode) {
            return res.status(404).json({
                message: "Promo code not found"
            });
        }

        res.status(200).json(promoCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createPromoCode, validatePromoCode, getAllPromoCodes, deletePromoCode, updatePromoCode, getPromoCodeById };