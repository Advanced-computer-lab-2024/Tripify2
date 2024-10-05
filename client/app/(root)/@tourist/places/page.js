"use client"; // Make sure this is included

import { fetcher } from "@/lib/fetch-client";
import { useEffect, useState } from "react";

async function getPlaces() {
  const res = await fetcher("/places", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!res.ok) {
    throw new Error("Failed to fetch places");
  }
  return res.json();
}

async function getTags() {
  const res = await fetcher("/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }
  return res.json();
}

async function getCategories() {
  const res = await fetcher("/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedTags, setSelectedTags] = useState([]); // Array to hold selected tags
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

  // Handle tag selection
  const handleTagChange = (tagId) => {
    setSelectedTags(
      (prev) =>
        prev.includes(tagId)
          ? prev.filter((id) => id !== tagId) // Deselect tag if already selected
          : [...prev, tagId] // Select tag if not selected
    );
  };

  // Filter places by the selected tags and search term
  const filteredPlaces = places.filter((place) => {
    const matchesTag = selectedTags.length
      ? selectedTags.some((tagId) => place.Tags.includes(tagId))
      : true;

    // Check if the search term matches the place name or any tag name
    const matchesSearch =
      place.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.Tags.some((tagId) =>
        getTagNameById(tagId).toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTag && matchesSearch;
  });

  return (
    <div className="flex container mx-auto px-4">
      {/* Filter Section */}
      <div className="w-1/4 p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Filter by Tags
        </h2>
        {tags.map((tag) => (
          <div key={tag._id} className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag._id)}
                onChange={() => handleTagChange(tag._id)}
                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{tag.Tag}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="w-3/4 p-6">
        {/* Search input */}
        <div className="mb-4 text-right">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or tag"
            className="border rounded-md p-3 text-black w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
        </div>

        {/* Places Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place._id}
              className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow bg-white"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {place.Name}
              </h2>
              {place.Pictures && place.Pictures.length > 0 && (
                <img
                  src={place.Pictures[0]}
                  alt={place.Name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              )}
              <button
                onClick={() => (window.location.href = `/places/${place._id}`)}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
