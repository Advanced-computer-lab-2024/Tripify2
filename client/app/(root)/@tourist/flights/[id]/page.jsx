import { notFound } from 'next/navigation'
import { getCityName } from '@/lib/utils'
import BookingForm from './booking-form'
import { fetcher } from '@/lib/fetch-client'
import FlightPrice from './flight-price'

export default async function FlightDetailsPage({ params }) {
  const flightData = await fetcher(`/flights/${params.id}`)

  if (!flightData.ok) {
    notFound()
  }

  const flight = await flightData.json()

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Flight Details</h1>
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Departure</h2>
            <p>From: {getCityName(flight.origin)} ({flight.origin})</p>
            <p>To: {getCityName(flight.destination)} ({flight.destination})</p>
            <p>Date: {new Date(flight.departureDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">Return</h2>
            <p>From: {getCityName(flight.destination)} ({flight.destination})</p>
            <p>To: {getCityName(flight.origin)} ({flight.origin})</p>
            <p>Date: {new Date(flight.returnDate).toLocaleDateString()}</p>
          </div>
        </div>
        <FlightPrice price={flight.price.total} />
      </div>
      <BookingForm flightId={flight._id} flightPrice={flight.price.total} />
    </div>
  )
}