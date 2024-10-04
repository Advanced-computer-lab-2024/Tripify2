"use client";

export default function ItineraryDetails({ params }) {
  const { itineraryInfo } = params;

  // Extract itinerary details
  const itineraryDetails = Object.entries(itineraryInfo).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );

  const {
    Activities,
    TourGuide,
    Locations,
    DatesAndTimes,
    Language,
    Price,
    EndDate,
    Image,
    Pickup,
    StartDate,
    Tag,
    Category,
  } = itineraryDetails;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <img
        src={Image}
        alt="Itinerary"
        className="w-full h-auto rounded-lg shadow-md mb-4"
      />

      <p className="text-lg font-bold text-center mb-4">${Price}</p>
      <hr className="my-4 border-gray-300" />

      <h1 className="text-3xl font-bold text-center mb-6">Itinerary Details</h1>

      <h2 className="text-2xl font-semibold mt-4">Activities</h2>
      <ul className="list-disc list-inside mb-4 pl-5">
        {Activities.map((activity, index) => (
          <li key={index} className="mb-2">
            <div className="bg-gray-100 p-4 rounded-md shadow-sm">
              <span className="font-bold">Type:</span> {activity.type} <br />
              <span className="font-bold">Duration:</span> {activity.duration}{" "}
              hours
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-4">Tour Guide's Experience</h2>
      <p className="mb-4">{TourGuide?.YearsOfExperience} years</p>

      <h2 className="text-2xl font-semibold mt-4">Locations</h2>
      <p className="mb-4">{Locations}</p>

      <h2 className="text-2xl font-semibold mt-4">Dates and Times</h2>
      <ul className="list-disc list-inside mb-4 pl-5">
        {DatesAndTimes.map((date, index) => (
          <li key={index} className="mb-2">
            {new Date(date).toLocaleString()}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-4">Language</h2>
      <p className="mb-4">{Language}</p>

      <h2 className="text-2xl font-semibold mt-4">End Date</h2>
      <p className="mb-4">{new Date(EndDate).toLocaleDateString()}</p>

      <h2 className="text-2xl font-semibold mt-4">Pickup Location</h2>
      <p className="mb-4">{Pickup}</p>

      <h2 className="text-2xl font-semibold mt-4">Start Date</h2>
      <p className="mb-4">{new Date(StartDate).toLocaleDateString()}</p>

      <h2 className="text-2xl font-semibold mt-4">Tags</h2>
      <ul className="list-disc list-inside mb-4 pl-5">
        {Tag.map((tag, index) => (
          <li key={index} className="mb-2">
            {tag.Tag}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-4">Categories</h2>
      <ul className="list-disc list-inside mb-4 pl-5">
        {Category.map((category, index) => (
          <li key={index} className="mb-2">
            {category.Category}
          </li>
        ))}
      </ul>
    </div>
  );
}
