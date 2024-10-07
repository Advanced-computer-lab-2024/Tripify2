"use client";

export default function ItineraryDetails({ activity }) {
  if (!activity) {
    return <p>Loading...</p>;
  }

  const {
    Name = "Activity Name Not Available",
    Date: theDate,
    Time: theTime,
    Location = "Location Not Available",
    Price = 0,
    Duration = "Duration Not Available",
    Image = "",
    SpecialDiscounts = 0,
    Tags = [],
    CategoryId = [],
    AdvertiserId = {},
  } = activity;

  // Format Date and Time
  const formattedDate =
    new Date(theDate).toLocaleDateString() || "Date Not Available";
  const formattedTime =
    new Date(theTime).toLocaleTimeString() || "Time Not Available";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="w-full h-full flex flex-col items-center p-8">
        <div className="flex justify-center  w-full mb-6">
          {Image ? (
            <img
              src={Image}
              className="w-50 h-64 object-cover rounded-md"
              style={{ objectFit: "cover" }}
              alt="Activity"
            />
          ) : (
            <div className="h-64 bg-gray-300 rounded-md flex items-center justify-center">
              <p>No Image Available</p>
            </div>
          )}
        </div>

        <div className="w-full space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            {Name}
          </h1>

          <h3 className="text-lg font-semibold text-center">
            Date: {formattedDate} - Time: {formattedTime}
          </h3>

          {/* <div className="text-gray-600 text-center">
            <p className="font-medium">Location: {Location}</p>
          </div> */}

          <div className="space-y-2 text-center">
            <p className="text-xl font-bold text-gray-800">
              Price: <span className="text-green-600">${Price}</span>
            </p>
            <p className="text-md text-gray-700">Duration: {Duration}</p>
          </div>

          {SpecialDiscounts > 0 && (
            <p className="text-md text-gray-700 text-center">
              Special Discounts: {SpecialDiscounts}%
            </p>
          )}

          <div className="mt-4">
            <h2 className="text-xl font-semibold text-center">Tags:</h2>
            <ul className="flex flex-wrap justify-center space-x-2">
              {Tags.length > 0 ? (
                Tags.map((tag) => (
                  <li
                    key={tag._id}
                    className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag.Tag || "Tag Not Available"}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">No Tags Available</li>
              )}
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold text-center">Categories:</h2>
            <ul className="flex flex-wrap justify-center space-x-2">
              {Array.isArray(CategoryId) && CategoryId.length > 0 ? (
                CategoryId.map((category) => (
                  <li
                    key={category._id}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {category.Category || "Category Not Available"}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">No Categories Available</li>
              )}
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold text-center">
              Advertiser Information:
            </h2>
            <p className="text-gray-700 text-center">
              Advertiser ID: {AdvertiserId._id || "Advertiser ID Not Available"}
            </p>
            <p className="text-gray-700 text-center">
              Website: {AdvertiserId.Website || "Website Not Available"}
            </p>
            <p className="text-gray-700 text-center">
              Hotline: {AdvertiserId.Hotline || "Hotline Not Available"}
            </p>
            <p className="text-gray-700 text-center">
              Profile: {AdvertiserId.Profile || "Profile Not Available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
