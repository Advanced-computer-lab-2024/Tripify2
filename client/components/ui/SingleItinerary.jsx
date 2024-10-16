"use client";

import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";

// import StarRating from "../starRating";

export default function ItineraryDetails({ itinerary }) {
  const { currency } = useCurrencyStore()

  if (!itinerary) return <p>Loading...</p>;

  const {
    Activities = [],
    Category = [],
    DatesAndTimes,
    Dropoff,
    EndDate,
    Image,
    Inappropriate,
    Language,
    Location,
    Name,
    Pickup,
    Price,
    Rating,
    StartDate,
    Tag = [],
    TourGuide,
    Accesibility,
  } = itinerary;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl p-6 mx-auto rounded-lg">
        <div className="image--container">
          <img
            src={Image}
            className="object-cover w-full h-64 mb-6 rounded-md"
            alt="Tour"
          />
        </div>

        <div className="space-y-6 details--container">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{Name}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-xl font-semibold text-yellow-500">{Rating}</p>
              {/* <StarRating rating={Rating} /> */}
            </div>
          </div>

          <h3 className="text-lg font-semibold">
            From: {StartDate} - To: {EndDate}
          </h3>

          <div className="space-y-2">
            <p className="text-lg font-bold text-gray-800">
              Price: <span className="text-green-600">{currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'} {convertPrice(Price, currency)}</span>
            </p>
            <p className="text-gray-700 text-md">Language: {Language}</p>
            <p className="text-md">
              Accessibility:{" "}
              {Accesibility ? (
                <span className="text-green-600">Accessible</span>
              ) : (
                <span className="text-red-600">Not Accessible</span>
              )}
            </p>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold">Activities:</h2>
            <ul className="list-disc list-inside">
              {Activities.map((activity, index) => (
                <li key={index} className="text-gray-700">
                  {activity.Name} - {activity.Duration} hours
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold">Schedule:</h2>
            <ul className="list-disc list-inside">
              {DatesAndTimes.map((dateTime, index) => (
                <li key={index} className="text-gray-700">
                  {dateTime}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start justify-between mt-4">
            <div>
              <h2 className="font-semibold text-md">Pickup Location:</h2>
              <p className="text-gray-700">{Pickup}</p>
            </div>
            <div>
              <h2 className="font-semibold text-md">Dropoff Location:</h2>
              <p className="text-gray-700">{Dropoff}</p>
            </div>
          </div>

          <div className="flex flex-wrap mt-4 space-x-4">
            <div>
              <h2 className="text-lg font-semibold">Categories:</h2>
              <ul className="flex flex-wrap space-x-2">
                {Category.map((cat) => (
                  <li
                    key={cat._id}
                    className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                  >
                    {cat.Category}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Tags:</h2>
              <ul className="flex flex-wrap space-x-2">
                {Tag.map((tag) => (
                  <li
                    key={tag._id}
                    className="px-3 py-1 text-sm text-yellow-800 bg-yellow-100 rounded-full"
                  >
                    {tag.Tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
