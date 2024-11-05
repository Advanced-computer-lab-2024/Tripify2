'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCityName, getCountryName } from '@/lib/utils'

export default function CustomizeVacationPage({ tags, categories, flights, places }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [availableFlights, setAvailableFlights] = useState(flights)
  const [availableTags, setAvailableTags] = useState(tags)
  const [availableCategories, setAvailableCategories] = useState(categories)
  const [availablePlaces, setAvailablePlaces] = useState(places)

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    router.push(`/vacation-results?origin=${origin}&destination=${destination}&tags=${selectedTags.join(',')}&categories=${selectedCategories.join(',')}&startDate=${startDate}&endDate=${endDate}&places=${selectedPlaces.join(',')}`)
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Customize Your Perfect Vacation</h1>
      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Where are you traveling from?</h2>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select origin</option>
              {availableFlights.map((flight) => (
                <option key={flight.origin} value={flight.origin}>
                  {getCityName(flight.origin)} ({flight.origin})
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Where do you want to go?</h2>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select destination</option>
              {availableFlights
                .filter((flight) => flight.origin !== origin)
                .map((flight) => (
                  <option key={flight.destination} value={flight.destination}>
                    {getCityName(flight.destination)} ({flight.destination})
                  </option>
                ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">When do you want to travel?</h2>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">What are you interested in?</h2>
            <div className="mb-4">
              <h3 className="mb-2 font-medium">Tags:</h3>
              {availableTags.map((tag) => (
                <label key={tag._id} className="inline-flex items-center mb-2 mr-4">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag._id)}
                    onChange={() => {
                      if (selectedTags.includes(tag._id)) {
                        setSelectedTags(selectedTags.filter((t) => t !== tag._id))
                      } else {
                        setSelectedTags([...selectedTags, tag._id])
                      }
                    }}
                    className="w-5 h-5 text-blue-600 form-checkbox"
                  />
                  <span className="ml-2">{tag.Tag}</span>
                </label>
              ))}
            </div>
            <div>
              <h3 className="mb-2 font-medium">Categories:</h3>
              {availableCategories.map((category) => (
                <label key={category._id} className="inline-flex items-center mb-2 mr-4">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => {
                      if (selectedCategories.includes(category._id)) {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category._id))
                      } else {
                        setSelectedCategories([...selectedCategories, category._id])
                      }
                    }}
                    className="w-5 h-5 text-blue-600 form-checkbox"
                  />
                  <span className="ml-2">{category.Category}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {step === 5 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Where are you going?</h2>
            <div className="mb-4">
              <h3 className="mb-2 font-medium">Places:</h3>
              {availablePlaces.map((place) => (
                <label key={place._id} className="inline-flex items-center mb-2 mr-4">
                  <input
                    type="checkbox"
                    checked={selectedPlaces.includes(place._id)}
                    onChange={() => {
                      if (selectedPlaces.includes(place._id)) {
                        setSelectedPlaces(selectedPlaces.filter((p) => p !== place._id))
                      } else {
                        setSelectedPlaces([...selectedPlaces, place._id])
                      }
                    }}
                    className="w-5 h-5 text-blue-600 form-checkbox"
                  />
                  <span className="ml-2">{place.Name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={
                (step === 1 && !origin) ||
                (step === 2 && !destination) ||
                (step === 3 && (!startDate || !endDate))
              }
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              disabled={selectedTags.length === 0 || selectedCategories.length === 0}
            >
              Find My Perfect Vacation
            </button>
          )}
        </div>
      </div>
    </div>
  )
}