const Transportation = require("../models/Transportation");

const getTransportations = async (req, res) => {
    const { type, location, capacity, startDate, endDate } = req.query;

    const query = {};
    if (type) query.type = type;
    if (location) query.location = location;
    if (capacity) query.capacity = { $gte: parseInt(capacity) };

    try {
        const transportations = await Transportation.find(query);
        // Filter based on availability if dates are provided
        const availableTransportations = startDate && endDate ?
            transportations.filter(t => t.availability) : transportations;

        return res.status(200).json(availableTransportations);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch transportations' });
    }
};

const getTransportation = async (req, res) => {
    const { id } = req.params;

    try {
        const transportation = await Transportation.findById(id);
        if (!transportation) {
            return res.status(404).json({ msg: "Transportation not found" });
        }
        return res.status(200).json(transportation);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch transportation' });
    }
};

module.exports = {
    getTransportations,
    getTransportation
};