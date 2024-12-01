"use client";
import { fetcher } from "@/lib/fetch-client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  // console.log("-----------------------------");
  // console.log(`bookmarkedActivity: ${bookmarkedActivity}`);
  // console.log("-----------------------------");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetcher(`/activities`).catch((e) =>
          console.log(e)
        );

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

  // console.log(activities);

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
    setBookmarkedActivity((prev) => {
      const updatedBookmarkedActivities = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
      debounceSendPatchRequest(updatedBookmarkedActivities);
      return updatedBookmarkedActivities;
    });
  };

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debounceSendPatchRequest = debounce(
    async (updatedBookmarkedActivities) => {
      try {
        await fetcher(`/tourists/${touristId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            BookmarkedActivity: updatedBookmarkedActivities,
          }),
        });
      } catch (e) {
        console.error("Failed to update bookmarks:", e);
      }
    },
    300
  );

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

  //console.log(activitiesWithCategoriesAndTags);

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
          <label htmlFor="priceRange" className="mb-2 font-bold text-black">
            Price: <span className="font-normal">{filteredPrice}</span>
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
          <label htmlFor="ratingFilter" className="mb-2 font-bold text-black">
            Rating: <span className="font-normal">{filteredRating}</span>
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

        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSortRating}
            className="p-2 text-black bg-blue-500 rounded hover:bg-blue-600"
          >
            Rating {sortOrderRating === "desc" ? "↑" : "↓"}
          </button>
          <button
            onClick={handleSortPrice}
            className="p-2 mr-4 text-black bg-blue-500 rounded hover:bg-blue-600"
          >
            Price {sortOrderPrice === "desc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {filteredActivities.map((activity) => {
            const isBookmarked = bookmarkedActivity.includes(activity._id);
            return (
              <Card
                key={activity._id}
                className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                onClick={() => router.push(`/activities/${activity._id}`)}
              >
                <CardHeader>
                  <img
                    src={activity.Image}
                    alt={activity.Name}
                    className="object-cover w-full h-48 mb-2 rounded-lg"
                  />
                  <CardTitle className="text-lg font-bold">
                    {activity.Name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="mr-1">{activity.Rating}</span>
                    </div>
                    <div
                      className="text-2xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent parent click event
                        handleBookmark(activity._id);
                      }}
                    >
                      {isBookmarked ? (
                        <RiBookmarkFill className="text-yellow-500" />
                      ) : (
                        <RiBookmarkLine className="text-gray-500" />
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-sm text-black-600">
                    <p>
                      Price:{" "}
                      {currency === "USD"
                        ? "$"
                        : currency === "EUR"
                        ? "€"
                        : "EGP"}{" "}
                      {convertPrice(activity.Price, currency)}
                    </p>
                    <p>Advertiser: {activity.AdvertiserId._id}</p>

                    <p>Date: {new Date(activity.Date).toLocaleDateString()}</p>

                    <p>
                      Tags:{" "}
                      {activity.Tags.map((tag) => (
                        <Badge
                          key={tag._id}
                          variant="neutral"
                          className={`text-white bg-blue-500 mr-2`}
                        >
                          {tag.Tag}
                        </Badge>
                      ))}
                    </p>
                    <p>
                      Categories:{" "}
                      {activity.CategoryId.map((category) => (
                        <Badge
                          key={category._id}
                          variant="neutral"
                          className={`text-white bg-blue-500 mr-2`}
                        >
                          {category.Category}
                        </Badge>
                      ))}
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityComponent;
