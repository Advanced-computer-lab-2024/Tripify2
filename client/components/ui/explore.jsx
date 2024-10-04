"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Explore({ params }) {
  const { itineraries, activities, places } = params;
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredPlaces = places.filter((place) =>
    place.Location.toLowerCase().includes(search.toLowerCase())
  );
  const filteredItineraries = itineraries.filter((itinerary) =>
    itinerary.Locations.toLowerCase().includes(search.toLowerCase())
  );
  const filteredActivities = activities.filter((activity) =>
    activity.Location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-48 sm:mx-50 md:mx-52 lg:mx-54 xl:mx-56 mt-5">
      <input
        type="text"
        placeholder="Where are you going?"
        className="pl-10 pr-4 py-2 w-full border rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />

      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
          <span>Itineraries ({filteredItineraries.length})</span>
          <button
            onClick={() => router.push("/itineraries")}
            className="text-sm bg-gray-400 text-white rounded px-2 py-1 hover:bg-gray-500 transition duration-200"
          >
            View All
          </button>
        </h2>
        {filteredItineraries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItineraries.map((itinerary) => (
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

      <hr />

      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
          <span>Activities ({filteredActivities.length})</span>
          <button
            onClick={() => router.push("/activities")}
            className="text-sm bg-gray-400 text-white rounded px-2 py-1 hover:bg-gray-500 transition duration-200"
          >
            View All
          </button>
        </h2>
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity._id}
                className="border border-gray-200 rounded-lg p-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={activity.Image}
                  alt={activity.Name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="text-lg font-medium">{activity.Location}</p>
                <p className="text-gray-500">Price: ${activity.Price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No activities available.</p>
        )}
      </section>

      <hr />

      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
          <span>Places ({filteredPlaces.length})</span>
          <button
            onClick={() => router.push("/places")}
            className="text-sm bg-gray-400 text-white rounded px-2 py-1 hover:bg-gray-500 transition duration-200"
          >
            View All
          </button>
        </h2>
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPlaces.map((place) => {
              let leastPrice = Infinity;
              if (typeof place.TicketPrices === "object") {
                Object.entries(place.TicketPrices).forEach(([_, price]) => {
                  if (price < leastPrice) {
                    leastPrice = price;
                  }
                });
              }

              return (
                <div
                  key={place._id}
                  className="border border-gray-200 rounded-lg p-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <img
                    src={place.Pictures.length ? place.Pictures[0] : ""}
                    alt={place.Location}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-medium">{place.Location}</h3>
                  <p className="text-gray-600">From ${leastPrice}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No places available.</p>
        )}
      </section>
    </div>
  );
}
