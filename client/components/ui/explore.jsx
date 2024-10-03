"use client";

export default function Explore({ params }) {
  const { itineraries, activities /*, places */ } = params;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Explore</h1>

      <section className="my-6">
        <h2 className="text-2xl font-semibold mb-2">
          Itineraries ({itineraries.length})
        </h2>
        {itineraries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-8 gap-4">
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

      <section className="my-6">
        <h2 className="text-2xl font-semibold mb-2">Activities</h2>
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      {/* Uncomment this section when ready */}
      {/* <section className="my-6">
        <h2 className="text-2xl font-semibold mb-2">Places</h2>
        {places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {places.map((place) => (
              <div key={place._id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-medium">{place.name}</h3>
                <p>{place.description}</p>
                <p className="text-gray-600">Address: {place.address}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No places available.</p>
        )}
      </section> */}
    </div>
  );
}
