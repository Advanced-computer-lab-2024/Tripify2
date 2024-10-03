"use client";

export default function Explore({ params }) {
  const { itineraries, activities, places } = params;

  return (
    <div className="mx-48 sm:mx-50 md:mx-52 lg:mx-54 xl:mx-56 mt-5">
      <input
        type="text"
        placeholder="Where are you going?"
        class="pl-10 pr-4 py-2 w-full border rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
      />

      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-6">
          Itineraries ({itineraries.length})
        </h2>
        {itineraries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary._id}
                className="border border-gray-200 rounded-lg p-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={itinerary.Image}
                  alt={itinerary.Locations}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-medium">{itinerary.Locations}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No itineraries available.</p>
        )}
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-6">
          Activities ({activities.length})
        </h2>
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-medium">{activity.name}</h3>
                <p>{activity.description}</p>
                <p className="text-gray-600">Location: {activity.location}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No activities available.</p>
        )}
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-6">
          Places ({places.length})
        </h2>
        {places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {places.map((place) => (
              <div
                key={place._id}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-medium">{place.name}</h3>
                <p>{place.description}</p>
                <p className="text-gray-600">Address: {place.address}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No places available.</p>
        )}
      </section>
    </div>
  );
}
