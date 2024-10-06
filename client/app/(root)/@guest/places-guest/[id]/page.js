"use client";
import { fetcher } from "@/lib/fetch-client";

async function getPlace(id) {
  const res = await fetcher(`/places/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!res.ok) {
    throw new Error("Failed to fetch place details");
  }
  return res.json();
}

const PlaceDetailsPage = async ({ params }) => {
  const { id } = params;
  const place = await getPlace(id);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl mx-auto p-6 rounded-lg">
        <div className="image--container">
          <img
            src={place.Pictures[0]}
            alt={place.Name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        </div>

        <div className="details--container space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{place.Name}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-xl text-yellow-500 font-semibold">
                {place.Type}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold">
            Opening Hours: {place.OpeningHours}
          </h3>

          <div className="space-y-2">
            <p className="text-lg font-bold text-gray-800">Ticket Prices:</p>
            <ul className="list-disc ml-5 mb-4">
              {Object.entries(place.TicketPrices).map(([type, price]) => (
                <li key={type}>
                  {type}: ${price}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-lg mb-2">
          <strong>Description:</strong> {place.Description}
        </p>

        <p className="text-lg font-semibold mb-2">Tags:</p>
        <ul className="list-disc ml-5 mb-4">
          {place.Tags && place.Tags.length > 0 ? (
            place.Tags.map((tag) => (
              <li key={tag._id} className="text-lg">
                {tag.Tag}
              </li>
            ))
          ) : (
            <li>No tags available</li>
          )}
        </ul>

        {/* Displaying Categories */}
        <p className="text-lg font-semibold mb-2">Categories:</p>
        <ul className="list-disc ml-5 mb-4">
          {place.Categories && place.Categories.length > 0 ? (
            place.Categories.map((category) => (
              <li key={category._id} className="text-lg">
                {category.Category}
              </li>
            ))
          ) : (
            <li>No categories available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PlaceDetailsPage;
