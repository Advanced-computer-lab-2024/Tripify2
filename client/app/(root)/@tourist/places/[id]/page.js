import { fetcher } from "@/lib/fetch-client";
import SharePlace from "./share-place";

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
      <div className="max-w-4xl p-6 mx-auto rounded-lg">
        <div className="image--container">
          <img
            src={place.Pictures[0]}
            alt={place.Name}
            className="object-cover w-full h-64 mb-4 rounded-lg"
          />
        </div>

        <SharePlace place={place} />

        <div className="space-y-6 details--container">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{place.Name}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-xl font-semibold text-yellow-500">
                {place.Type}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold">
            Opening Hours: {place.OpeningHours}
          </h3>

          <div className="space-y-2">
            <p className="text-lg font-bold text-gray-800">Ticket Prices:</p>
            <ul className="mb-4 ml-5 list-disc">
              {Object.entries(place.TicketPrices).map(([type, price]) => (
                <li key={type}>
                  {type}: ${price}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mb-2 text-lg">
          <strong>Description:</strong> {place.Description}
        </p>

        <p className="mb-2 text-lg font-semibold">Tags:</p>
        <ul className="mb-4 ml-5 list-disc">
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
        <p className="mb-2 text-lg font-semibold">Categories:</p>
        <ul className="mb-4 ml-5 list-disc">
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
