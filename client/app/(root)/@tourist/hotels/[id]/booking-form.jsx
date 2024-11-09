'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { convertPrice } from "@/lib/utils"
import { useCurrencyStore } from "@/providers/CurrencyProvider"
import { fetcher } from '@/lib/fetch-client'

export default function BookingForm({ hotelId, offers }) {
  const { currency } = useCurrencyStore()
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  console.log(selectedOffer)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedOffer) return

    setIsLoading(true)

    try
    {
      const response = await fetcher(`/bookings/hotels/create-booking/${hotelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currency,
          OfferId: selectedOffer.id,
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

    setIsLoading(false)
    // router.push(`/booking-confirmation/${hotelId}`)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">Book Your Stay</h2>
      <div className="mb-4">
        <label htmlFor="offer" className="block mb-2 text-sm font-medium text-gray-700">
          Select an Offer
        </label>
        <select
          id="offer"
          value={selectedOffer?.id || ''}
          onChange={(e) => setSelectedOffer(offers.find(offer => offer.id === e.target.value) || null)}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select an offer</option>
          {offers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {new Date(offer.checkInDate).toLocaleDateString()} - {new Date(offer.checkOutDate).toLocaleDateString()} (${offer.price.total} {offer.price.currency})
            </option>
          ))}
        </select>
      </div>
      {selectedOffer && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">Selected Offer Details:</h3>
          <p>Room Type: {selectedOffer.room.type}</p>
          <p>Beds: {selectedOffer.room.typeEstimated.beds} {selectedOffer.room.typeEstimated.bedType}</p>
          <p>Description: {selectedOffer.room.description}</p>
          <p>Guests: {selectedOffer.guests.adults} adults</p>
          <p className="font-bold">Total Price: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}{convertPrice(selectedOffer.price.total, currency)}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading || !selectedOffer}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isLoading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  )
}