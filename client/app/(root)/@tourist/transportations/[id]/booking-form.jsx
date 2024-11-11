'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrencyStore } from '@/providers/CurrencyProvider'
import { fetcher } from '@/lib/fetch-client'
import { useSession } from 'next-auth/react'

export default function BookingForm({ transportId, isAvailable }) {
    const { currency } = useCurrencyStore()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [pickupLocation, setPickupLocation] = useState('')
    const [dropoffLocation, setDropoffLocation] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { data: session } = useSession()

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
                    dropoffLocation
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
                        onChange={(e) => setStartDate(e.target.value)}
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
                        onChange={(e) => setEndDate(e.target.value)}
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