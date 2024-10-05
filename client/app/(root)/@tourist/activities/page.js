"use client";
import { fetcher } from "@/lib/fetch-client";
import { useEffect, useState } from "react";

const ItineraryComponent = () => {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPrice, setFilteredPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [allPossibleCategories, setAllPossibleCategories] = useState([]);
  const [allPossibleTags, setAllPossibleTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredRating, setFilteredRating] = useState(5);
  const [selectedStartDate, setSelectedStartDate] = useState(""); // State for date filter

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetcher(`/activities`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return <>error</>;
        }

        const data = await response.json();
        setActivities(data);

        const maxPriceFromData = Math.max(
          ...data.map((activity) => activity.Price)
        );
        setMaxPrice(maxPriceFromData);
        setFilteredPrice(maxPriceFromData);

        const categoriesSet = new Set();
        const tagsSet = new Set();

        data.forEach((activity) => {
          activity.CategoryId.forEach((category) => {
            categoriesSet.add(category.Category);
          });
          activity.Tags.forEach((tag) => {
            tagsSet.add(tag.Tag);
          });
        });

        setAllPossibleCategories(Array.from(categoriesSet));
        setAllPossibleTags(Array.from(tagsSet));
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleRangeChangePrice = (e) => {
    setFilteredPrice(e.target.value);
  };

  const handleRangeChangeRating = (e) => {
    setFilteredRating(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    );
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag)
        : [...prevSelected, tag]
    );
  };

  const activitiesWithCategoriesAndTags =
    selectedCategories.length === 0 && selectedTags.length === 0
      ? activities
      : activities.filter((activity) => {
          const categoryMatches = activity.CategoryId.some((category) => {
            return selectedCategories.includes(category.Category);
          });
          const tagMatches = activity.Tags.some((tag) => {
            return selectedTags.includes(tag.Tag);
          });

          return tagMatches || categoryMatches;
        });

  const filteredActivities = activitiesWithCategoriesAndTags.filter(
    (activity, index) => {
      const lowerCaseSearch = search.toLowerCase();
      const nameMatches = activity.Name.toLowerCase().includes(lowerCaseSearch);

      const categoryMatches = activity.CategoryId.some((category) => {
        return category.Category.toLowerCase().includes(lowerCaseSearch);
      });
      const tagMatches = activity.Tags.some((tag) => {
        return tag.Tag.toLowerCase().includes(lowerCaseSearch);
      });

      console.log(`${index}: ` + categoryMatches, tagMatches);
      const priceMatches = activity.Price <= filteredPrice;
      //   const ratingMatches = activity.Rating <= filteredRating;
      const startDateMatches =
        selectedStartDate === "" ||
        new Date(activity.Date) >= new Date(selectedStartDate);

      return (
        (nameMatches || categoryMatches || tagMatches) &&
        priceMatches &&
        /*ratingMatches &&*/
        startDateMatches
      );
    }
  );

  return (
    <div className="grid grid-cols-6 h-screen">
      <div className="p-4 col-span-1">
        <h2 className="text-black font-bold text-lg mb-6">Filter</h2>

        {/* Categories Filter */}
        <div className="mb-4">
          <h3 className="text-black font-bold mb-2">Categories</h3>
          {allPossibleCategories.map((category) => (
            <div key={category} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={category}
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2"
              />
              <label htmlFor={category} className="text-black">
                {category}
              </label>
            </div>
          ))}
        </div>

        {/* Tags Filter */}
        <div className="mb-4">
          <h3 className="text-black font-bold mb-2">Tags</h3>
          {allPossibleTags.map((tag) => (
            <div key={tag} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={tag}
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
                className="mr-2"
              />
              <label htmlFor={tag} className="text-black">
                {tag}
              </label>
            </div>
          ))}
        </div>

        {/* Date Filter */}
        <div className="mb-4">
          <h3 className="text-black font-bold mb-2">Start Date</h3>
          <input
            type="date"
            value={selectedStartDate}
            onChange={(e) => setSelectedStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="priceRange" className="block mb-2 text-black">
            Price: {filteredPrice}
          </label>
          <input
            id="priceRange"
            type="range"
            className="w-full range"
            min="0"
            max={maxPrice}
            value={filteredPrice}
            onChange={handleRangeChangePrice}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ratingFilter" className="block mb-2 text-black">
            Rating: {filteredRating}
          </label>
          <input
            id="ratingFilter"
            type="range"
            className="w-full range"
            min="0"
            max="5"
            step="0.1"
            value={filteredRating}
            onChange={handleRangeChangeRating}
          />
        </div>
      </div>

      {/* Itineraries List */}
      <div className="col-span-5 p-4 overflow-auto">
        <h2 className="text-black font-bold text-2xl mb-4">Activities</h2>

        {/* Search Input at the Top */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredActivities.map((activity) => (
            <button
              key={activity._id}
              className="bg-white shadow rounded-lg p-4 transition hover:shadow-lg"
            >
              <img
                src={activity.Image}
                alt={activity.Name}
                className="w-full h-48 object-cover mb-2 rounded-lg"
              />
              <h3 className="font-bold text-lg mb-2">{activity.Name}</h3>
              <p className="text-gray-700 mb-1">Price: ${activity.Price}</p>
              <p className="text-gray-700 mb-1">
                Advertiser: {activity.AdvertiserId.Name}
              </p>
              <p className="text-gray-700 mb-1">
                Categories:{" "}
                {activity.CategoryId.map((category) => category.Category).join(
                  ", "
                )}
              </p>
              <p className="text-gray-700 mb-1">
                Tags: {activity.Tags.map((tag) => tag.Tag).join(", ")}
              </p>
              <p className="text-gray-700 mb-1">
                Date: {new Date(activity.Date).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryComponent;
