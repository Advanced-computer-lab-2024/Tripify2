'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrencyStore } from '@/providers/CurrencyProvider'
import { fetcher } from '@/lib/fetch-client'

export default function BookingForm({ flightId }) {
  const { currency } = useCurrencyStore()
  const [seats, setSeats] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try
    {
      const response = await fetcher(`/bookings/flights/create-booking/${flightId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currency,
          NumberSeats: seats,
        })
      })

      if(!response?.ok) {
        const data = await response.json()
        console.log(data.msg)
        setIsLoading(false)
        return
      }

      const data = await response.json()

      if(!data) {
        console.log('Error creating booking')
        return
      }

      router.push(data.url)
    }
    catch (error)
    {
      console.log(error)
    }

    // router.push(`/booking-confirmation/${flightId}`)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">Book Your Seats</h2>
      <div className="mb-4">
        <label htmlFor="seats" className="block text-sm font-medium text-gray-700">
          Number of Seats
        </label>
        <input
          type="number"
          id="seats"
          min="1"
          max="10"
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isLoading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  )
}