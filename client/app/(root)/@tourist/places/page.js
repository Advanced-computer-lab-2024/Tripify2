"use client"; // Make sure this is included

import { useEffect, useState } from "react";

async function getPlaces() {
  const res = await fetch("http://localhost:3001/places", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch places");
  }
  return res.json();
}

async function getTags() {
  const res = await fetch("http://localhost:3001/tags", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }
  return res.json();
}

async function getCategories() {
  const res = await fetch("http://localhost:3001/categories", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedTag, setSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placesData = await getPlaces();
        const tagsData = await getTags();
        const categoriesData = await getCategories(); // Fetch categories data
        console.log("Fetched tags:", tagsData); // Log the tags data
        setPlaces(placesData);
        setTags(tagsData);
        setCategories(categoriesData); // Set categories data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to get tag name by ID
  const getTagNameById = (tagId) => {
    const tag = tags.find((tag) => tag._id === tagId);
    return tag ? tag.Tag : ""; // Return the Tag name or empty string if not found
  };

  // Filter places by the selected tag and search term
  const filteredPlaces = places.filter((place) => {
    const matchesTag = selectedTag ? place.Tags.includes(selectedTag) : true;

    // Check if the search term matches the place name, any category name, or any tag name
    const matchesSearch =
      place.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Check if any category name matches the search term
      categories.some(
        (category) =>
          place.Categories.includes(category._id) &&
          category.Category.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      place.Tags.some((tagId) =>
        getTagNameById(tagId).toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTag && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6 text-center">Places</h1>

      {/* Search input */}
      <div className="mb-4 text-center">
        <label htmlFor="search" className="mr-2 font-semibold">
          Search:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, category, or tag"
          className="border rounded-md p-2 text-black"
        />
      </div>

      {/* Dropdown to select a tag */}
      <div className="mb-4 text-center">
        <label htmlFor="tagFilter" className="mr-2 font-semibold">
          Filter by Tag:
        </label>
        <select
          id="tagFilter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border rounded-md p-2 text-black" // Ensure text color is visible
        >
          <option value="">All Tags</option>
          {Array.isArray(tags) && tags.length > 0 ? (
            tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.Tag}{" "}
                {/* Make sure to use the correct property name here */}
              </option>
            ))
          ) : (
            <option disabled>No tags available</option>
          )}
        </select>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
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
