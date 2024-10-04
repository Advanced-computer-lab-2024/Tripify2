"use client";
export default function TouristItineraries({ itineraries }) {
  return (
    <div className="flex flex-col container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Tourist Itineraries
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itineraries.map((itinerary) => (
          <div
            key={itinerary._id}
            className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow bg-white"
          >
            <img
              src={itinerary.Image}
              alt={`Itinerary ${itinerary._id}`}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Price: ${itinerary.Price}
            </h2>
            <hr className="my-2" />
            <h3 className="text-lg font-medium text-gray-700">
              Dates & Times:
            </h3>
            <ul className="list-disc list-inside mb-2">
              {itinerary.DatesAndTimes.map((date, index) => (
                <li key={index} className="text-gray-600">
                  {new Date(date).toLocaleString()}
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-medium text-gray-700">Activities:</h3>
            <ul className="list-disc list-inside mb-2">
              {itinerary.Activities.map((activity, index) => (
                <li key={index} className="text-gray-600">
                  {activity.name}
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-medium text-gray-700">Tour Guide:</h3>
            <p className="text-gray-600">
              {itinerary.TourGuide.PreviousWork} -{" "}
              {itinerary.TourGuide.YearsOfExperience} years of experience
            </p>
            <p className="text-gray-600">
              Contact: {itinerary.TourGuide.MobileNumber}
            </p>

            <button
              onClick={() =>
                (window.location.href = `/itineraries/${itinerary._id}`)
              }
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
