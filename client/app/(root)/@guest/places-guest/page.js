"use client";
import { fetcher } from "@/lib/fetch-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
        // console.log("Fetched tags:", tagsData); // Log the tags data
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

  const router = useRouter();
  return (
    <div className="grid grid-cols-6 h-screen">
      {/* Filter Section */}
      <div className="col-span-1 p-4">
        <h2 className="text-black font-bold text-lg mb-6">Filter</h2>
        <div className="mb-4">
          <h3 className="text-black font-bold mb-2">Tags</h3>
          {tags.map((tag) => (
            <div key={tag._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={tag._id}
                checked={selectedTags.includes(tag._id)}
                onChange={() => handleTagChange(tag._id)}
                className="mr-2"
              />
              <label htmlFor={tag._id} className="text-black">
                {tag.Tag}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Main Section */}
      <div className="col-span-5 p-4 overflow-auto">
        <h2 className="text-black font-bold text-2xl mb-4">Places</h2>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or tag"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Places Cards */}
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlaces.map((place) => (
            <button
              key={place._id}
              className="bg-white shadow rounded-lg p-4 transition hover:shadow-lg"
              onClick={() => router.push(`/places-guest/${place._id}`)}
            >
              {place.Pictures && place.Pictures.length > 0 && (
                <img
                  src={place.Pictures[0]}
                  alt={place.Name}
                  className="w-full h-48 object-cover mb-2 rounded-lg"
                />
              )}
              <h3 className="font-bold text-lg mb-2">{place.Name}</h3>

              <p className="text-gray-700 mb-1">
                Tags:{" "}
                {place.Tags.map((tagId) => {
                  const foundTag = tags.find(
                    (actualTag) => actualTag._id === tagId
                  );
                  return foundTag ? foundTag.Tag : null;
                }).join(", ")}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
