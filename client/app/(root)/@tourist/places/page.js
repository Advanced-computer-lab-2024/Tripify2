"use client";

async function getPlaces() {
  const res = await fetch("http://localhost:3001/places", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch places");
  }
  return res.json();
}

const PlacesPage = async () => {
  const places = await getPlaces();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6 text-center">Places</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <li
            key={place._id}
            className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{place.Name}</h2>
            {place.Pictures && place.Pictures.length > 0 && (
              <img
                src={place.Pictures[0]}
                alt={place.Name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
            )}
            <button
              onClick={() => (window.location.href = `/places/${place._id}`)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlacesPage;
