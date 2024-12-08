"use client";
import { fetcher } from "@/lib/fetch-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";

export default function ViewPlace() {
  const params = useParams();
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tagsButton, setTagsButton] = useState([]); // To store fetched tags
  const [categoriesButton, setCategoriesButton] = useState([]); // To store fetched categories
  const [updatedPlace, setUpdatedPlace] = useState({
    Name: "",
    Description: "",
    Type: "",
    Location: "",
    OpeningHours: "",
    Pictures: "",
    TicketPrices: "",
    Tags: [],
    Categories: [],
  });
  const [originalPlace, setOriginalPlace] = useState({
    Name: "",
    Description: "",
    Type: "",
    Location: "",
    OpeningHours: "",
    Pictures: "",
    TicketPrices: "",
    Tags: [],
    Categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const handleLocationSelect = (location) => {
    setUpdatedPlace((prevData) => ({
      ...prevData,
      Location: location,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetcher("/categories"),
          fetcher("/tags"),
        ]);

        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error("Error fetching categories or tags:", err);
      }
    };

    fetchData();
  }, []);

  // Fetch place data when the component mounts
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/places/${params.id}`
        );
        const data = await response.json();
        setPlace(data);
        //console.log(data);
        setUpdatedPlace({
          Name: data.Name,
          Description: data.Description,
          Type: data.Type,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          Pictures: data.Pictures.join(", "),
          TicketPrices: data.TicketPrices,
          Tags: data.Tags.map((tag) => tag._id),
          Categories: data.Categories.map((category) => category._id),
        });

        setOriginalPlace({
          Name: data.Name,
          Description: data.Description,
          Type: data.Type,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          Pictures: data.Pictures.join(", "),
          TicketPrices: data.TicketPrices,
          Tags: data.Tags.map((tag) => tag._id),
          Categories: data.Categories.map((category) => category._id),
        });

        //console.log(`TicketPrices: ${JSON.stringify(data.TicketPrices)}`);
        setSelectedCategories(data.Categories.map((category) => category._id));
        setSelectedTags(data.Tags.map((tag) => tag._id));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlace();
  }, [params.id]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        // Otherwise, add it
        return [...prevSelected, categoryId];
      }
    });

    // Update form data with the new selected categories
    setUpdatedPlace((prevFormData) => ({
      ...prevFormData,
      Categories: selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId) // Remove category if it's already selected
        : [...selectedCategories, categoryId], // Add category if it's not selected
    }));
  };

  //console.log("categoriessssss:   "+categories)

  const handleTagChange = (tagId) => {
    setSelectedTags((prevSelected) => {
      if (prevSelected.includes(tagId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== tagId);
      } else {
        // Otherwise, add it
        return [...prevSelected, tagId];
      }
    });

    // Update form data with the new selected categories
    setUpdatedPlace((prevFormData) => ({
      ...prevFormData,
      Tag: selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId) // Remove category if it's already selected
        : [...selectedTags, tagId], // Add category if it's not selected
    }));
  };

  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      try {
        // Fetch Tags
        const tagResponse = await fetch("http://localhost:3001/tags");
        const tagData = await tagResponse.json();
        setTagsButton(tagData);

        // Fetch Categories
        const categoryResponse = await fetch(
          "http://localhost:3001/categories"
        );
        const categoryData = await categoryResponse.json();
        setCategoriesButton(categoryData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTagsAndCategories();
  }, []);

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [noChange, setNoChange] = useState(true);

  useEffect(() => {
    const hasChanges =
      JSON.stringify(updatedPlace) !== JSON.stringify(originalPlace);
    setNoChange(!hasChanges);
  }, [updatedPlace, originalPlace]);
  
  // Update place data
  const handleUpdate = async () => {
    // check route
    try {
      const response = await fetcher(`/places/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedPlace,
          Pictures: updatedPlace.Pictures.split(","),
          TicketPrices: updatedPlace.TicketPrices,
          Tags: updatedPlace.Tags,
          Categories: updatedPlace.Categories,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlace(data);
        alert("Place updated successfully!");
        router.push("/"); // Redirect after update
      } else {
        setError("Failed to update place.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading place details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddPair = () => {
    if (key.trim() !== "") {
      setUpdatedPlace((prevPlace) => ({
        ...prevPlace,
        TicketPrices: {
          ...prevPlace.TicketPrices,
          [key]: value,
        },
      }));
      setKey("");
      setValue("");
    }
  };

  const handleEditValue = (key, newValue) => {
    setUpdatedPlace((prevPlace) => ({
      ...prevPlace,
      TicketPrices: {
        ...prevPlace.TicketPrices,
        [key]: newValue,
      },
    }));
  };

  const handleDeletePair = (keyToDelete) => {
    setUpdatedPlace((prevPlace) => {
      const { [keyToDelete]: _, ...rest } = prevPlace.TicketPrices;
      return {
        ...prevPlace,
        TicketPrices: rest,
      };
    });
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Update Place</h1>

      <div className="w-full max-w-4xl space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={updatedPlace.Name}
          onChange={(e) =>
            setUpdatedPlace({ ...updatedPlace, Name: e.target.value })
          }
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Description"
          value={updatedPlace.Description}
          onChange={(e) =>
            setUpdatedPlace({ ...updatedPlace, Description: e.target.value })
          }
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Type"
          value={updatedPlace.Type}
          onChange={(e) =>
            setUpdatedPlace({ ...updatedPlace, Type: e.target.value })
          }
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Location:</h3>
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </div>

        {updatedPlace.Location && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Selected Location:</h4>
            <LocationViewer location={updatedPlace.Location} />
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Opening Hours:</h3>
          <input
            type="text"
            placeholder="Opening Hours"
            value={updatedPlace.OpeningHours}
            onChange={(e) =>
              setUpdatedPlace({ ...updatedPlace, OpeningHours: e.target.value })
            }
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Picture:</h3>
          <input
            type="text"
            placeholder="Pictures (comma-separated URLs)"
            value={updatedPlace.Pictures}
            onChange={(e) =>
              setUpdatedPlace({ ...updatedPlace, Pictures: e.target.value })
            }
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-md space-y-4">
          <h2 className="text-xl font-bold">Ticket Prices</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter ticket type"
              className="flex-1 p-3 border rounded-md focus:ring focus:ring-blue-300"
            />
            <input
              type="number"
              value={value || ""}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter price"
              className="flex-1 p-3 border rounded-md focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleAddPair}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(updatedPlace.TicketPrices || {}).map(([k, v]) => (
              <div key={k} className="flex items-center gap-4">
                <span className="w-1/3 font-medium">{k}:</span>
                <span>{v}</span>
                <input
                  type="number"
                  value={v || ""}
                  onChange={(e) => handleEditValue(k, e.target.value)}
                  className="flex-1 p-3 border rounded-md focus:ring focus:ring-blue-300"
                />
                <button
                  onClick={() => handleDeletePair(k)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="block mb-4">
          <span className="block mb-2 font-bold text-lg">Categories:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label
                key={category._id}
                className={`cursor-pointer p-2 border rounded ${
                  selectedCategories.includes(category._id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  value={category._id}
                  onChange={() => handleCategoryChange(category._id)}
                  checked={selectedCategories.includes(category._id)}
                  className="hidden" // Hide the default checkbox
                />{" "}
                {category.Category}
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="block mb-4">
          <span className="block mb-2 font-bold text-lg">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag._id}
                className={`cursor-pointer p-2 border rounded ${
                  selectedTags.includes(tag._id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  value={tag._id}
                  onChange={() => handleTagChange(tag._id)}
                  checked={selectedTags.includes(tag._id)}
                  className="hidden" // Hide the default checkbox
                />
                {tag.Tag}
              </label>
            ))}
          </div>
        </div>
        {/* Update Button */}
        <Button
          onClick={handleUpdate}
          className="text-white py-2 px-4 rounded w-full mt-2"
          disabled={noChange}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
