const Flight = require("../models/Flight");

async function getFlights(req, res) {
    const { origin, destination, startDate: departureDate } = req.query;

    const query = {};
    
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;
    // if (departureDate) query.departureDate = {
    //     $gte: new Date(departureDate)
    // };

    console.log(query)

    try {
        const flights = await Flight.find(query);
        const flightsFiltered = departureDate ? flights.filter(flight => flight.departureDate >= new Date(departureDate)) : flights
        return res.status(200).json(flightsFiltered);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch flights' });
    }
}

async function getFlight(req, res) {
    const { id } = req.params;

    const flight = await Flight.findById(id)

    if (!flight) {
        return res.status(404).json({ msg: "Flight not found" });
    }

    return res.status(200).json(flight);
}

module.exports = {
    getFlights,
    getFlight
}