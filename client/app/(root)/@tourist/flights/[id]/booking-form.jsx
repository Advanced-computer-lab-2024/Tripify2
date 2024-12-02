'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrencyStore } from '@/providers/CurrencyProvider'
import { fetcher } from '@/lib/fetch-client'
import { Loader2, Tag } from 'lucide-react'

export default function BookingForm({ flightId, flightPrice }) {
  const { currency } = useCurrencyStore()
  const [seats, setSeats] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')
  const [validatingPromo, setValidatingPromo] = useState(false)
  const [discountedPrice, setDiscountedPrice] = useState(null)
  const router = useRouter()

  const validatePromoCode = async () => {
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
          amount: flightPrice * seats
        })
      })

      if (!response.ok) {
        const error = await response.json()
        setPromoError(error.message)
        setDiscountedPrice(null)
        return
      }

      const data = await response.json()
      console.log(data.discount)
      console.log(flightPrice)
      console.log(seats)
      setDiscountedPrice(data.type === 'percentage' ? (((100 - data.value) / 100) * flightPrice) * seats : ((flightPrice * seats) - data.value))
      setPromoSuccess(data.type === 'percentage'
        ? `${data.value}% discount applied!`
        : `${currency} ${data.value} discount applied!`)
    } catch (error) {
      setPromoError('Error validating promo code')
      setDiscountedPrice(null)
    } finally {
      setValidatingPromo(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetcher(`/bookings/flights/create-booking/${flightId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currency,
          NumberSeats: seats,
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

      <div className="mb-6">
        <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">
          Promo Code
        </label>
        <div className="flex mt-1 space-x-2">
          <input
            type="text"
            id="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="block w-full uppercase border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="button"
            onClick={validatePromoCode}
            disabled={validatingPromo}
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
        {discountedPrice && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 line-through">
              Original Price: {currency} {flightPrice * seats}
            </p>
            <p className="text-sm font-medium text-blue-600">
              Discounted Price: {currency} {discountedPrice}
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
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