'use client'
import { useState } from 'react'

function TransportationCard({ booking }) {
    const isActive = new Date(booking.EndDate) >= new Date()

    return (
        <div className={`bg-white shadow-md rounded-lg p-4 ${!isActive ? 'opacity-75' : ''}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold">{booking.TransportationId?.name}</div>
                <div className="px-2 py-1 text-sm text-white bg-blue-500 rounded">
                    {booking.TransportationId?.type}
                </div>
            </div>
            <div className="mb-2 text-sm text-gray-600">
                <div>From: {new Date(booking.StartDate).toLocaleDateString()}</div>
                <div>To: {new Date(booking.EndDate).toLocaleDateString()}</div>
            </div>
            <div className="mb-2 text-sm">
                <div><span className="font-medium">Pickup:</span> {booking.PickupLocation}</div>
                <div><span className="font-medium">Dropoff:</span> {booking.DropoffLocation}</div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="text-sm">
                    <span className={`px-2 py-1 rounded ${isActive ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {isActive ? 'Active' : 'Past'}
                    </span>
                </div>
                <div className="text-lg font-bold text-green-600">
                    {booking.Currency === 'USD' ? '$' : booking.Currency === 'EUR' ? '€' : 'EGP'}
                    {booking.TotalPaid}
                </div>
            </div>
        </div>
    )
}

export default function BookedTransportationPage({ transportationData }) {
    const [bookings, setBookings] = useState(transportationData)
    const [filter, setFilter] = useState('all')

    const filterBookings = (filterType) => {
        setFilter(filterType)
        const currentDate = new Date()

        if (filterType === 'active') {
            setBookings(transportationData.filter(booking => new Date(booking.EndDate) >= currentDate))
        } else if (filterType === 'past') {
            setBookings(transportationData.filter(booking => new Date(booking.EndDate) < currentDate))
        } else {
            setBookings(transportationData)
        }
    }

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">My Transportation Bookings</h1>
            <div className="mb-6">
                <label htmlFor="filter" className="block mb-2 text-sm font-medium text-gray-700">Filter Bookings</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => filterBookings(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="all">All Bookings</option>
                    <option value="active">Active Bookings</option>
                    <option value="past">Past Bookings</option>
                </select>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                    <TransportationCard key={booking._id} booking={booking} />
                ))}
            </div>
            {bookings.length === 0 && (
                <p className="mt-8 text-center text-gray-500">
                    No transportation bookings found for the selected filter.
                </p>
            )}
        </div>
    )
}