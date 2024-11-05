const Hotel = require("../models/Hotel");

async function getHotels(req, res) {
    const hotels = await Hotel.find()

    return res.status(200).json(hotels);
}

async function getHotel(req, res) {
    const { id } = req.params;

    const hotel = await Hotel.findById(id)

    if (!hotel) {
        return res.status(404).json({ msg: "Hotel not found" });
    }

    return res.status(200).json(hotel);
}

module.exports = {
    getHotels,
    getHotel
}