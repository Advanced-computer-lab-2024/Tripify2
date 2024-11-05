'use client'
import { convertPrice, getCityName, getCountryName } from '@/lib/utils'
import { getCountryFromCoordinates } from '@/lib/utils'
import { useCurrencyStore } from '@/providers/CurrencyProvider'

export default function VacationResultsPage({ flights, hotels, itineraries, activities }) {
  const { currency } = useCurrencyStore()

  const vacationPackages = flights.flatMap(flight =>
    hotels.flatMap(hotel =>
      itineraries.flatMap(itinerary =>
        activities.map(activity => ({
          flight,
          hotel,
          itinerary,
          activity
        }))
      )
    )
  )

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Your Perfect Vacation Matches</h1>
      {vacationPackages.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vacationPackages.map((vacation, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-xl font-semibold">
                {getCityName(vacation.flight.origin)} to {getCityName(vacation.flight.destination)}
              </h2>
              <div className="mb-4">
                <h3 className="font-medium">Flight</h3>
                <p>From: {getCityName(vacation.flight.origin)} ({vacation.flight.origin})</p>
                <p>To: {getCityName(vacation.flight.destination)} ({vacation.flight.destination})</p>
                <p>Price: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}{convertPrice(vacation.flight.price.total, currency)}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium">Hotel</h3>
                <p>{vacation.hotel.name}</p>
                <p>Price per night: Starting From {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}{convertPrice(vacation.hotel.offers.reduce((min, offer) => 
                    parseFloat(offer.price.total) < min ? parseFloat(offer.price.total) : min, 
                    parseFloat(vacation.hotel.offers[0].price.total)
                  ), currency)}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium">Itinerary</h3>
                <p>{vacation.itinerary.Name}</p>
                <p>Price: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}{convertPrice(vacation.itinerary.Price, currency)}</p>
                <p>Location: {getCountryFromCoordinates(vacation.itinerary.Location.coordinates[0], vacation.itinerary.Location.coordinates[1]).countryName}</p>
                <p>Categories: {vacation.itinerary.Category.map(c => c.Category).join(', ')}</p>
                <p>Tags: {vacation.itinerary.Tag.map(t => t.Tag).join(', ')}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium">Activity</h3>
                <p>{vacation.activity.Name}</p>
                <p>Price: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}{convertPrice(vacation.activity.Price, currency)}</p>
                <p>Location: {getCountryFromCoordinates(vacation.activity.Location.coordinates[0], vacation.activity.Location.coordinates[1]).countryName}</p>
                <p>Categories: {vacation.activity.CategoryId.map(c => c.Category).join(', ')}</p>
                <p>Tags: {vacation.activity.Tags.map(t => t.Tag).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No matching vacations found. Try adjusting your preferences.</p>
      )}
    </div>
  )
}