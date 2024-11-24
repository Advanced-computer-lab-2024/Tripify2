"use client";
import { fetcher } from "@/lib/fetch-client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";

const ActivityComponent = ({ params }) => {
  const { currency } = useCurrencyStore();

  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPrice, setFilteredPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [allPossibleCategories, setAllPossibleCategories] = useState([]);
  const [allPossibleTags, setAllPossibleTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredRating, setFilteredRating] = useState(5);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [sortOrderRating, setSortOrderRating] = useState("desc");
  const [sortOrderPrice, setSortOrderPrice] = useState("desc");

  const { touristId, bookmarkedActivitiesTourist } = params;

  const [bookmarkedActivity, setBookmarkedActivity] = useState(
    bookmarkedActivitiesTourist
  );

  console.log("-----------------------------");
  console.log(`bookmarkedActivity: ${bookmarkedActivity}`);
  console.log("-----------------------------");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetcher(`/activities`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((e) => console.log(e));

        if (!response.ok) {
          return <>error</>;
        }

        const data = await response.json();
        setActivities(data);

        const maxPriceFromData = Math.max(
          ...data.map((activity) => convertPrice(activity.Price, currency))
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

  const handleSortRating = () => {
    const sortedActivities = [...activities].sort((a, b) => {
      return sortOrderRating === "desc"
        ? b.Rating - a.Rating
        : a.Rating - b.Rating;
    });
    setSortOrderRating(sortOrderRating === "desc" ? "asc" : "desc");
    setActivities(sortedActivities);
  };

  const handleSortPrice = () => {
    const sortedActivities = [...activities].sort((a, b) => {
      return sortOrderPrice === "desc" ? b.Price - a.Price : a.Price - b.Price;
    });
    setSortOrderPrice(sortOrderPrice === "desc" ? "asc" : "desc");
    setActivities(sortedActivities);
  };

  const handleBookmark = (id) => {
    let updatedState;
    setBookmarkedActivity((prev) => {
      if (prev.includes(id))
        updatedState = prev.filter((itemId) => itemId !== id);
      else updatedState = [...prev, id];
      return updatedState;
    });
  };

  const sendPatchRequest = async () => {
    try {
      const response = await fetcher(`/tourists/${touristId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
        body: JSON.stringify({
          BookmarkedActivity: bookmarkedActivity,
        }),
      });

      if (!response?.ok) console.error("Failed to send PATCH request");
    } catch (e) {
      console.error("Error occurred while sending PATCH request:", e);
    }
  };

  useEffect(() => {
    sendPatchRequest();
  }, [bookmarkedActivity]);

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

      // console.log(`${index}: ` + categoryMatches, tagMatches);
      const newActivityPrice = convertPrice(activity.Price, currency);
      const priceMatches = Number(newActivityPrice) <= filteredPrice;
      const ratingMatches = activity.Rating <= filteredRating;
      const startDateMatches =
        selectedStartDate === "" ||
        new Date(activity.Date) >= new Date(selectedStartDate);

      return (
        (nameMatches || categoryMatches || tagMatches) &&
        priceMatches &&
        ratingMatches &&
        startDateMatches
      );
    }
  );

  return (
    <div className="grid h-screen grid-cols-6">
      <div className="col-span-1 p-4">
        <h2 className="mb-6 text-lg font-bold text-black">Filter</h2>

        <div className="mb-4">
          <h3 className="mb-2 font-bold text-black">Categories</h3>
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

        <div className="mb-4">
          <h3 className="mb-2 font-bold text-black">Tags</h3>
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

        <div className="mb-4">
          <h3 className="mb-2 font-bold text-black">Start Date</h3>
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
            max={Math.round(maxPrice)}
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

      <div className="col-span-5 p-4 overflow-auto">
        <h2 className="mb-4 text-2xl font-bold text-black">Activities</h2>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={handleSortPrice}
            className="p-2 mr-4 text-black bg-blue-500 rounded hover:bg-blue-600"
          >
            Sort by Price {sortOrderPrice === "desc" ? "↑" : "↓"}
          </button>

          <button
            onClick={handleSortRating}
            className="p-2 text-black bg-blue-500 rounded hover:bg-blue-600"
          >
            Sort by Rating {sortOrderRating === "desc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {filteredActivities.map((activity) => {
            const isBookmarked = bookmarkedActivity.includes(activity._id);
            return (
              <button
                key={activity._id}
                className="relative p-4 transition bg-white rounded-lg shadow hover:shadow-lg"
                onClick={() => router.push(`/activities/${activity._id}`)}
              >
                <img
                  src={activity.Image}
                  alt={activity.Name}
                  className="object-cover w-full h-48 mb-2 rounded-lg"
                />
                <h3 className="mb-2 text-lg font-bold">{activity.Name}</h3>
                <p className="mb-1 text-gray-700">Rating: {activity.Rating}</p>
                <p className="mb-1 text-gray-700">
                  Price:{" "}
                  {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}
                  {convertPrice(activity.Price, currency)}
                </p>
                <p className="mb-1 text-gray-700">
                  Advertiser: {activity.AdvertiserId._id}
                </p>
                <p className="mb-1 text-gray-700">
                  Categories:{" "}
                  {activity.CategoryId.map(
                    (category) => category.Category
                  ).join(", ")}
                </p>
                <p className="mb-1 text-gray-700">
                  Tags: {activity.Tags.map((tag) => tag.Tag).join(", ")}
                </p>
                <p className="mb-1 text-gray-700">
                  Date: {new Date(activity.Date).toLocaleDateString()}
                </p>
                <div
                  className="absolute top-2 right-2 text-2xl"
                  onClick={(e) => {
                    e.stopPropagation(); //prevent parent button click event listener from listening on clicking this child button
                    handleBookmark(activity._id);
                  }}
                >
                  {isBookmarked ? (
                    <RiBookmarkFill className="text-yellow-500" />
                  ) : (
                    <RiBookmarkLine className="text-gray-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityComponent;
