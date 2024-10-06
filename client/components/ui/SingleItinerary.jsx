"use client";
// import StarRating from "../starRating";

export default function ItineraryDetails({ itinerary }) {
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
      <div className="max-w-4xl mx-auto p-6 rounded-lg">
        <div className="image--container">
          <img
            src={Image}
            className="w-full h-64 object-cover rounded-md mb-6"
            alt="Tour"
          />
        </div>

        <div className="details--container space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{Name}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-xl text-yellow-500 font-semibold">{Rating}</p>
              {/* <StarRating rating={Rating} /> */}
            </div>
          </div>

          <h3 className="text-lg font-semibold">
            From: {StartDate} - To: {EndDate}
          </h3>

          <div className="space-y-2">
            <p className="text-lg font-bold text-gray-800">
              Price: <span className="text-green-600">${Price}</span>
            </p>
            <p className="text-md text-gray-700">Language: {Language}</p>
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

          <div className="flex justify-between items-start mt-4">
            <div>
              <h2 className="text-md font-semibold">Pickup Location:</h2>
              <p className="text-gray-700">{Pickup}</p>
            </div>
            <div>
              <h2 className="text-md font-semibold">Dropoff Location:</h2>
              <p className="text-gray-700">{Dropoff}</p>
            </div>
          </div>

          <div className="flex flex-wrap space-x-4 mt-4">
            <div>
              <h2 className="text-lg font-semibold">Categories:</h2>
              <ul className="flex flex-wrap space-x-2">
                {Category.map((cat) => (
                  <li
                    key={cat._id}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
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
                    className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
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
