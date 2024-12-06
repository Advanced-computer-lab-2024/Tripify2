"use client";
import { fetcher } from "@/lib/fetch-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

  const handleLocationSelect = (location) => {
    setUpdatedPlace((prevData) => ({
      ...prevData,
      Location: location,
    }));
  };

  // Fetch place data when the component mounts
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/places/${params.id}`
        );
        const data = await response.json();
        setPlace(data);
        console.log(data);
        console.log(data);
        setUpdatedPlace({
          Name: data.Name,
          Description: data.Description,
          Type: data.Type,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          Pictures: data.Pictures.join(", "),
          TicketPrices: JSON.stringify(data.TicketPrices),
          Tags: data.Tags.map((tag) => tag._id),
          Categories: data.Categories.map((category) => category._id),
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlace();
  }, [params.id]);

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
          TicketPrices: JSON.parse(updatedPlace.TicketPrices),
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

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Place</h1>

      {/* Input Fields */}
      <div className="w-full max-w-lg space-y-4">
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
        {/* <input
          type="text"
          placeholder="Location"
          value={updatedPlace.Location}
          onChange={(e) =>
            setUpdatedPlace({ ...updatedPlace, Location: e.target.value })
          }
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        /> */}

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

        <input
          type="text"
          placeholder="Opening Hours"
          value={updatedPlace.OpeningHours}
          onChange={(e) =>
            setUpdatedPlace({ ...updatedPlace, OpeningHours: e.target.value })
          }
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Pictures (comma-separated URLs)"
          value={updatedPlace.Pictures}
          onChange={(e) =>
            setUpdatedPlace({ ...updatedPlace, Pictures: e.target.value })
          }
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Ticket Prices (JSON format)"
          value={updatedPlace.TicketPrices}
          onChange={(e) =>
            setUpdatedPlace({ ...updatedPlace, TicketPrices: e.target.value })
          }
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-full max-w-lg mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Select Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categoriesButton.map((category) => (
            <label key={category._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value={category._id}
                checked={updatedPlace.Categories.includes(category._id)}
                onChange={(e) => {
                  const selectedCategories = [...updatedPlace.Categories];
                  if (e.target.checked) selectedCategories.push(category._id);
                  else {
                    const index = selectedCategories.indexOf(category._id);
                    if (index > -1) selectedCategories.splice(index, 1);
                  }
                  setUpdatedPlace({
                    ...updatedPlace,
                    Categories: selectedCategories,
                  });
                }}
                className="focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">{category.Category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Select Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tagsButton.map((tag) => (
            <label key={tag._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="tag"
                value={tag._id}
                checked={updatedPlace.Tags.includes(tag._id)}
                onChange={(e) => {
                  const selectedTags = [...updatedPlace.Tags];
                  if (e.target.checked) selectedTags.push(tag._id);
                  else {
                    const index = selectedTags.indexOf(tag._id);
                    if (index > -1) selectedTags.splice(index, 1);
                  }
                  setUpdatedPlace({
                    ...updatedPlace,
                    Tags: selectedTags,
                  });
                }}
                className="focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">{tag.Tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Update Button */}
      <Button
        onClick={handleUpdate}
        className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Update Place
      </Button>
    </div>
  );
}
