'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { convertPrice } from "@/lib/utils"
import { useCurrencyStore } from "@/providers/CurrencyProvider"
import { fetcher } from '@/lib/fetch-client'
import { Loader2, Tag } from 'lucide-react'

export default function BookingForm({ hotelId, offers }) {
  const { currency } = useCurrencyStore()
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')
  const [validatingPromo, setValidatingPromo] = useState(false)
  const [discountedPrice, setDiscountedPrice] = useState(null)

  const validatePromoCode = async () => {
    if (!selectedOffer) {
      setPromoError('Please select an offer first')
      return
    }

    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code')
      return
    }

    setValidatingPromo(true)
    setPromoError('')
    setPromoSuccess('')

    try {
      const response = await fetcher('/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          amount: parseFloat(selectedOffer.price.total)
        })
      })

      if (!response.ok) {
        const error = await response.json()
        setPromoError(error.message)
        setDiscountedPrice(null)
        return
      }

      const data = await response.json()
      console.log(data)
      setDiscountedPrice(data.type === 'percentage' ? (((100 - data.value) / 100) * parseFloat(selectedOffer.price.total)) : ((parseFloat(selectedOffer.price.total)) - data.value))
      setPromoSuccess(data.type === 'percentage'
        ? `${data.value}% discount applied!`
        : `${currency} ${convertPrice(data.value, currency)} discount applied!`)
    } catch (error) {
      setPromoError('Error validating promo code')
      setDiscountedPrice(null)
    } finally {
      setValidatingPromo(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedOffer) return

    setIsLoading(true)

    try {
      const response = await fetcher(`/bookings/hotels/create-booking/${hotelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currency,
          OfferId: selectedOffer.id,
          promoCode: promoCode || undefined
        })
      })

      if (!response?.ok) {
        const data = await response.json()
        console.log(data.msg)
        setIsLoading(false)
        return
      }

      const data = await response.json()

      if (!data) {
        console.log('Error creating booking')
        return
      }

      router.push(data.url)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
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
          onChange={(e) => {
            setSelectedOffer(offers.find(offer => offer.id === e.target.value) || null)
            // Reset promo code related states when offer changes
            setPromoCode('')
            setPromoError('')
            setPromoSuccess('')
            setDiscountedPrice(null)
          }}
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
        <>
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">Selected Offer Details:</h3>
            <p>Room Type: {selectedOffer.room.type}</p>
            <p>Beds: {selectedOffer.room.typeEstimated.beds} {selectedOffer.room.typeEstimated.bedType}</p>
            <p>Description: {selectedOffer.room.description}</p>
            <p>Guests: {selectedOffer.guests.adults} adults</p>
          </div>

          <div className="mb-6">
            <label htmlFor="promoCode" className="block mb-2 text-sm font-medium text-gray-700">
              Promo Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="promoCode"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="flex-1 block px-3 py-2 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={validatePromoCode}
                disabled={validatingPromo || !selectedOffer}
                className="flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {validatingPromo ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Tag className="w-4 h-4 mr-2" />
                )}
                Apply
              </button>
            </div>
            {promoError && (
              <p className="mt-1 text-sm text-red-500">{promoError}</p>
            )}
            {promoSuccess && (
              <p className="mt-1 text-sm text-green-500">{promoSuccess}</p>
            )}
          </div>

          <div className="mb-6">
            <p className="font-bold">
              {discountedPrice ? (
                <>
                  <span className="block text-lg text-blue-600">
                    Discounted Price: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}
                    {convertPrice(discountedPrice, currency).toFixed(2)}
                  </span>
                  <span className="block text-sm text-gray-500 line-through">
                    Original Price: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}
                    {convertPrice(selectedOffer.price.total, currency)}
                  </span>
                </>
              ) : (
                <span className="text-lg">
                  Total Price: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}
                  {convertPrice(selectedOffer.price.total, currency)}
                </span>
              )}
            </p>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading || !selectedOffer}
        className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Booking...
          </>
        ) : (
          'Book Now'
        )}
      </button>
    </form>
  )
}