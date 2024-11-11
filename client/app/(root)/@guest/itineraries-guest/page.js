"use client";
import { fetcher } from "@/lib/fetch-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import StarRating from "../starRating";

const ItineraryComponent = () => {
  const router = useRouter();
  const [theItineraries, setTheItineraries] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPrice, setFilteredPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filteredRating, setFilteredRating] = useState(5);
  const [sortOrder, setSortOrder] = useState("desc");
  const [allPossibleCategories, setAllPossibleCategories] = useState([]);
  const [allPossibleTags, setAllPossibleTags] = useState([]);
  const [allPossibleLanguages, setAllPossibleLanguages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetcher("/itineraries", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((e) => console.log(e));
        const data = await response.json();
        setTheItineraries(data);

        const maxPriceFromData = Math.max(
          ...data.map((itinerary) => itinerary.Price)
        );
        setMaxPrice(maxPriceFromData);
        setFilteredPrice(maxPriceFromData);

        const categoriesSet = new Set();
        const tagsSet = new Set();
        const languagesSet = new Set();

        data.forEach((itinerary) => {
          itinerary.Category.forEach((category) => {
            categoriesSet.add(category.Category);
          });
          itinerary.Tag.forEach((tag) => {
            tagsSet.add(tag.Tag);
          });
          languagesSet.add(itinerary.Language);
        });

        setAllPossibleCategories(Array.from(categoriesSet));
        setAllPossibleTags(Array.from(tagsSet));
        setAllPossibleLanguages(Array.from(languagesSet));
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
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

  const handleSortRating = () => {
    const sortedItineraries = [...theItineraries].sort((a, b) => {
      return sortOrder === "desc" ? b.Rating - a.Rating : a.Rating - b.Rating;
    });
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    setTheItineraries(sortedItineraries);
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

  const itinerariesWithCategoriesAndTags =
    selectedCategories.length === 0 && selectedTags.length === 0
      ? theItineraries
      : theItineraries.filter((itinerary) => {
        const categoryMatches = itinerary.Category.some((category) => {
          return selectedCategories.includes(category.Category);
        });
        const tagMatches = itinerary.Tag.some((tag) => {
          return selectedTags.includes(tag.Tag);
        });

        return tagMatches || categoryMatches;
      });

  const filteredItineraries = itinerariesWithCategoriesAndTags.filter(
    (itinerary) => {
      const lowerCaseSearch = search.toLowerCase();
      const nameMatches =
        itinerary.Name.toLowerCase().includes(lowerCaseSearch);
      const categoryMatches = itinerary.Category.some((category) => {
        return category.Category.toLowerCase().includes(lowerCaseSearch);
      });
      const tagMatches = itinerary.Tag.some((tag) => {
        return tag.Tag.toLowerCase().includes(lowerCaseSearch);
      });
      const priceMatches = itinerary.Price <= filteredPrice;
      const ratingMatches = itinerary.Rating <= filteredRating;
      const languageMatches =
        selectedLanguage === "" || itinerary.Language === selectedLanguage;

      const startDateMatches =
        selectedStartDate === "" ||
        new Date(itinerary.StartDate) >= new Date(selectedStartDate);

      return (
        (nameMatches || categoryMatches || tagMatches) &&
        priceMatches &&
        ratingMatches &&
        languageMatches &&
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
          <h3 className="mb-2 font-bold text-black">Languages</h3>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All Languages</option>
            {allPossibleLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
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

      <div className="col-span-5 p-4 overflow-auto">
        <h2 className="mb-4 text-2xl font-bold text-black">Itineraries</h2>

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
            onClick={handleSortRating}
            className="p-2 text-black bg-blue-500 rounded hover:bg-blue-600"
          >
            Sort by Rating {sortOrder === "desc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {filteredItineraries.map((itinerary) => (
            <button
              key={itinerary.ID}
              className="p-4 overflow-hidden bg-white rounded-lg hover:shadow"
              onClick={() => router.push(`/itineraries-guest/${itinerary._id}`)}
            >
              <img
                src={itinerary.Image}
                alt={itinerary.Name}
                className="object-cover w-full h-48 mb-2 rounded-lg"
              />
              <h3 className="mb-2 text-lg font-bold">{itinerary.Name}</h3>
              <div className="flex justify-center mb-2">
                {itinerary.Rating}
                {/* <StarRating rating={itinerary.Rating} /> */}
              </div>
              <p className="text-black-600">Price: ${itinerary.Price}</p>
              <p className="text-black-600">Language: {itinerary.Language}</p>
              <p className="text-black-600">
                Tags: {itinerary.Tag.map((tag) => tag.Tag).join(", ")}
              </p>
              <p className="text-black-600">
                Categories:{" "}
                {itinerary.Category.map((category) => category.Category).join(
                  ", "
                )}
              </p>
              <p className="text-black-600">
                Start Date: {new Date(itinerary.StartDate).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryComponent;
