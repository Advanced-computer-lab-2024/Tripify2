'use client'
import { convertPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/providers/CurrencyProvider'
import { useState } from 'react'

function FlightCard({ flight }) {
  const isPastFlight = new Date(flight.FlightId?.returnDate) < new Date()

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${isPastFlight ? 'opacity-75' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold">{flight.FlightId?.origin} to {flight.FlightId?.destination}</div>
        <div className="text-sm text-gray-500">
          {new Date(flight.FlightId?.departureDate).toLocaleDateString()} - {new Date(flight.FlightId?.returnDate).toLocaleDateString()}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className={`px-2 py-1 rounded ${isPastFlight ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-700'}`}>
            {isPastFlight ? 'Past' : 'Upcoming'}
          </span>
        </div>
        <div className="text-lg font-bold text-green-600">{flight.Currency}{parseFloat(flight.TotalPaid) / 100}</div>
      </div>
    </div>
  )
}

export default function BookedFlightsPage({ flightsData }) {
  const [flights, setFlights] = useState(flightsData)
  const [filter, setFilter] = useState('all')

  console.log(flightsData)

  const filterFlights = (filterType) => {
    setFilter(filterType)
    const currentDate = new Date()

    if (filterType === 'upcoming') {
      setFlights(flightsData.filter(flight => new Date(flight.FlightId?.departureDate) >= currentDate))
    } else if (filterType === 'past') {
      setFlights(flightsData.filter(flight => new Date(flight.FlightId?.returnDate) < currentDate))
    } else {
      setFlights(flightsData)
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Booked Flights</h1>
      <div className="mb-6">
        <label htmlFor="filter" className="block mb-2 text-sm font-medium text-gray-700">Filter Flights</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => filterFlights(e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Flights</option>
          <option value="upcoming">Upcoming Flights</option>
          <option value="past">Past Flights</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flights.map((flight) => (
          <FlightCard key={flight.FlightId?._id} flight={flight} />
        ))}
      </div>
      {flights.length === 0 && (
        <p className="mt-8 text-center text-gray-500">No flights found for the selected filter.</p>
      )}
    </div>
  )
}