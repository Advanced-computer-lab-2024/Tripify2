'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrencyStore } from '@/providers/CurrencyProvider'
import { fetcher } from '@/lib/fetch-client'
import { useSession } from 'next-auth/react'
import { Loader2, Tag } from 'lucide-react'
import { convertPrice } from "@/lib/utils"

export default function BookingForm({ transportId, isAvailable, pricePerDay }) {
    const { currency } = useCurrencyStore()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [pickupLocation, setPickupLocation] = useState('')
    const [dropoffLocation, setDropoffLocation] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [promoCode, setPromoCode] = useState('')
    const [promoError, setPromoError] = useState('')
    const [promoSuccess, setPromoSuccess] = useState('')
    const [validatingPromo, setValidatingPromo] = useState(false)
    const [discountedPrice, setDiscountedPrice] = useState(null)
    const router = useRouter()
    const { data: session } = useSession()

    const calculateTotalDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const totalPrice = pricePerDay * calculateTotalDays();

    const validatePromoCode = async () => {
        if (!startDate || !endDate) {
            setPromoError('Please select dates first');
            return;
        }

        if (!promoCode.trim()) {
            setPromoError('Please enter a promo code');
            return;
        }

        setValidatingPromo(true);
        setPromoError('');
        setPromoSuccess('');

        try {
            const response = await fetcher('/promo-codes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: promoCode,
                    amount: totalPrice
                })
            });

            if (!response.ok) {
                const error = await response.json();
                setPromoError(error.message);
                setDiscountedPrice(null);
                return;
            }

            const data = await response.json();
            setDiscountedPrice(data.type === 'percentage' ? (((100 - data.value) / 100) * pricePerDay) * calculateTotalDays() : ((pricePerDay * calculateTotalDays()) - data.value))
            setPromoSuccess(data.type === 'percentage'
                ? `${data.value}% discount applied!`
                : `${currency} ${convertPrice(data.value, currency)} discount applied!`);
        } catch (error) {
            setPromoError('Error validating promo code');
            setDiscountedPrice(null);
        } finally {
            setValidatingPromo(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetcher(`/bookings/transportations/create-booking/${transportId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currency,
                    startDate,
                    endDate,
                    pickupLocation,
                    dropoffLocation,
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
            router.push(data.url)
        } catch (error) {
            console.log(error)
        }

        setIsLoading(false)
    }

    if (!session) {
        return (
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <p className="text-gray-600">Please log in to book this transportation.</p>
            </div>
        )
    }

    if (!isAvailable) {
        return (
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <p className="text-red-600">This vehicle is currently not available for booking.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Book Your Transportation</h2>
            <div className="grid gap-4 mb-4 md:grid-cols-2">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setPromoCode('');
                            setPromoError('');
                            setPromoSuccess('');
                            setDiscountedPrice(null);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setPromoCode('');
                            setPromoError('');
                            setPromoSuccess('');
                            setDiscountedPrice(null);
                        }}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
                        Pickup Location
                    </label>
                    <input
                        type="text"
                        id="pickupLocation"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
                        Dropoff Location
                    </label>
                    <input
                        type="text"
                        id="dropoffLocation"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
            </div>

            {/* Promo Code Section */}
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
                        className="flex-1 block px-3 py-2 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                        type="button"
                        onClick={validatePromoCode}
                        disabled={validatingPromo || !startDate || !endDate}
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

            {/* Price Display */}
            {calculateTotalDays() > 0 && (
                <div className="mb-6">
                    <h3 className="mb-2 font-semibold">Pricing Details:</h3>
                    <p className="text-sm text-gray-600">Duration: {calculateTotalDays()} days</p>
                    {discountedPrice ? (
                        <>
                            <p className="text-lg font-bold text-blue-600">
                                Final Price: {currency} {convertPrice(discountedPrice, currency)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                                Original Price: {currency} {convertPrice(totalPrice, currency)}
                            </p>
                        </>
                    ) : (
                        <p className="text-lg font-bold">
                            Total Price: {currency} {convertPrice(totalPrice, currency)}
                        </p>
                    )}
                </div>
            )}

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