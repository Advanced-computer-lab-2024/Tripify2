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
  const { id } = params; // Get the place ID from the URL parameters
  const place = await getPlace(id);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">{place.Name}</h1>
      {place.Pictures && place.Pictures.length > 0 && (
        <img
          src={place.Pictures[0]}
          alt={place.Name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <p className="text-lg mb-2">
        <strong>Type:</strong> {place.Type}
      </p>
      <p className="text-lg mb-2">
        <strong>Description:</strong> {place.Description}
      </p>
      <p className="text-lg mb-2">
        <strong>Location:</strong> {place.Location}
      </p>
      <p className="text-lg mb-2">
        <strong>Opening Hours:</strong> {place.OpeningHours}
      </p>
      <p className="text-lg font-semibold mb-2">Ticket Prices:</p>
      <ul className="list-disc ml-5 mb-4">
        {Object.entries(place.TicketPrices).map(([type, price]) => (
          <li key={type}>
            {type}: ${price}
          </li>
        ))}
      </ul>

      {/* Displaying Tags */}
      <p className="text-lg font-semibold mb-2">Tags:</p>
      <ul className="list-disc ml-5 mb-4">
        {place.Tags && place.Tags.length > 0 ? (
          place.Tags.map((tag) => (
            <li key={tag._id} className="text-lg">
              {tag.Tag} {/* Accessing the Name property */}
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
              {category.Category} {/* Accessing the Name property */}
            </li>
          ))
        ) : (
          <li>No categories available</li>
        )}
      </ul>
    </div>
  );
};

export default PlaceDetailsPage;
