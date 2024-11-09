'use client'

import { useState } from 'react'
import { format } from 'date-fns'

function HotelBookingCard({ booking }) {
  const offer = booking.HotelId.offers.find(o => o.id === booking.OfferId)
  const isPastBooking = new Date(offer?.checkOutDate || '') < new Date()

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${isPastBooking ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold">{booking.HotelId.name}</h2>
          <p className="text-sm text-gray-600">{booking.HotelId.address.countryCode}</p>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < booking.HotelId.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      {offer && (
        <div className="mb-2">
          <p className="text-sm">
            Check-in: {format(new Date(offer.checkInDate), 'MMM dd, yyyy')}
          </p>
          <p className="text-sm">
            Check-out: {format(new Date(offer.checkOutDate), 'MMM dd, yyyy')}
          </p>
          <p className="text-sm">{offer.room.description}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className={`px-2 py-1 rounded ${isPastBooking ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-700'}`}>
            {isPastBooking ? 'Past' : 'Upcoming'}
          </span>
        </div>
        <div className="text-lg font-bold text-green-600">
          {(booking.TotalPaid / 100).toFixed(2)} {booking.Currency}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Booked on: {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
      </p>
    </div>
  )
}

export default function BookedHotelsPage({ hotelsData }) {
  const [bookings, setBookings] = useState(hotelsData)
  const [filter, setFilter] = useState('all')

  const filterBookings = (filterType) => {
    setFilter(filterType)
    const currentDate = new Date()
    
    if (filterType === 'upcoming') {
      setBookings(hotelsData.filter(booking => {
        const offer = booking.HotelId.offers.find(o => o.id === booking.OfferId)
        return offer && new Date(offer.checkInDate) >= currentDate
      }))
    } else if (filterType === 'past') {
      setBookings(hotelsData.filter(booking => {
        const offer = booking.HotelId.offers.find(o => o.id === booking.OfferId)
        return offer && new Date(offer.checkOutDate) < currentDate
      }))
    } else {
      setBookings(hotelsData)
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Hotel Bookings</h1>
      <div className="mb-6">
        <label htmlFor="filter" className="block mb-2 text-sm font-medium text-gray-700">Filter Bookings</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => filterBookings(e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Bookings</option>
          <option value="upcoming">Upcoming Bookings</option>
          <option value="past">Past Bookings</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <HotelBookingCard key={booking._id} booking={booking} />
        ))}
      </div>
      {bookings.length === 0 && (
        <p className="mt-8 text-center text-gray-500">No bookings found for the selected filter.</p>
      )}
    </div>
  )
}