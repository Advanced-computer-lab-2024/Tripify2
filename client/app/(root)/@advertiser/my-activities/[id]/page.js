"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";

export default function EditActivity() {
  const [formData, setFormData] = useState({
    Name: "",
    Date: "",
    Time: "",
    Location: null,
    Price: "",
    SpecialDiscounts: "",
    Duration: "",
    Image: "",
    CategoryId: [],
    Tags: [],
  });
  const [categories, setCategories] = useState([]); // Available categories
  const [tags, setTags] = useState([]);
  const router = useRouter();
  const { id } = useParams(); // Getting the activity id from the URL

  // Fetch the existing activity data when component mounts
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetcher(`/activities/${id}`);
        if (response.ok) {
          const data = await response.json();
  
          const newFormData = {
            Name: data.activity.Name,
            Date: data.activity.Date.split("T")[0], // Extracting just the date part
            Time: data.activity.Time,
            Location: data.activity.Location,
            Price: data.activity.Price,
            SpecialDiscounts: data.activity.SpecialDiscounts,
            Duration: data.activity.Duration,
            Image: data.activity.Image || "",
            Tags: data.activity.Tags.map((tag) => tag._id),
            CategoryId: data.activity.CategoryId.map(
              (category) => category._id
            ),
          };
  
          setFormData(newFormData);
  
          // Set selectedTags and selectedCategories after formData is updated
          setSelectedTags(newFormData.Tags);
          setSelectedCategories(newFormData.CategoryId);
        } else {
          alert("Failed to fetch the activity.");
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };
  
    fetchActivity();
  }, [id]);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetcher("/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetcher("/tags");
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchCategories();
    fetchTags();
  }, [id]);

  const handleLocationSelect = (location) => {
    setFormData((formData) => ({
      ...formData,
      Location: location,
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const updatedCategories = checked
      ? [...formData.CategoryId, value]
      : formData.CategoryId.filter((category) => category !== value);

    setFormData({
      ...formData,
      CategoryId: updatedCategories,
    });
  };

  const handleTagChangeTwo = (tagId) => {
    setSelectedTags((prevSelected) => {
      if (prevSelected.includes(tagId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== tagId);
      } else {
        // Otherwise, add it
        return [...prevSelected, tagId];
      }
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      Tags: selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId],
    }));
  };

  const handleCategoryChangeTwo = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        // Otherwise, add it
        return [...prevSelected, categoryId];
      }
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      Categories: selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId],
    }));
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    const updatedTags = checked
      ? [...formData.Tags, value]
      : formData.Tags.filter((tag) => tag !== value);

    setFormData({
      ...formData,
      Tags: updatedTags,
    });
  };

  // Handle form submission to save the changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
    try {
      const response = await fetcher(`/activities/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        next: {
          revalidate: 0,
        },
      });

      if (response.ok) {
        alert("Activity updated successfully!");
        router.push("/my-activities"); // Redirect back to activities list
      } else {
        const errorData = await response.json(); // Extract the response body
        console.log(errorData); // Log the full error response
        alert(errorData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      alert("An error occurred while updating the activity.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded m-4">
      <h1 className="text-2xl font-bold mb-4">Edit Activity</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Name:</strong>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              className="border border-slate-300 rounded-lg p-2 w-full mb-4"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Date:</strong>
            <input
              type="date"
              name="Date"
              value={
                formData.Date
                  ? format(new Date(formData.Date), "yyyy-MM-dd")
                  : ""
              }
              onChange={handleInputChange}
              className="border border-slate-300 rounded-lg p-2 w-full mb-4"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Time:</strong>
            <input
              type="datetime-local"
              name="Time"
              value={
                formData.Time
                  ? format(new Date(formData.Time), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              onChange={handleInputChange}
              className="border border-slate-300 rounded-lg p-2 w-full mb-4"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Location:</strong>
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </label>
          {formData.Location && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Selected Location:</h4>
              <LocationViewer location={formData.Location} />
            </div>
          )}
        </div>
        <div>
          <label>
            <strong>Price:</strong>
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleInputChange}
              className="border border-slate-300 rounded-lg p-2 w-full mb-4"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Special Discounts:</strong>
            <input
              type="text"
              name="SpecialDiscounts"
              value={formData.SpecialDiscounts}
              onChange={handleInputChange}
              className="border border-slate-300 rounded-lg p-2 w-full mb-4"
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Duration:</strong>
            <input
              type="text"
              name="Duration"
              value={formData.Duration}
              onChange={handleInputChange}
              className="border border-slate-300 rounded-lg p-2 w-full mb-4"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Image:</strong>
            <input
              type="text"
              name="Image"
              value={formData.Image}
              onChange={handleInputChange}
              className="border border-slate-300 rounded-lg p-2 w-full mb-4"
            />
          </label>
          <img src={formData.Image} alt="Image" className="w-[300px] p-3"></img>
        </div>

        <div className="block mb-4">
          <span className="block mb-2 font-bold">Categories:</span>
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
                  onChange={() => handleCategoryChangeTwo(category._id)}
                  checked={selectedCategories.includes(category._id)}
                  className="hidden" // Hide the default checkbox
                />
                {category.Category}
              </label>
            ))}
          </div>
        </div>
        <div className="block mb-4">
          <span className="block mb-2 font-bold">Tags:</span>
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
                  onChange={() => handleTagChangeTwo(tag._id)}
                  checked={selectedTags.includes(tag._id)}
                  className="hidden" // Hide the default checkbox
                />
                {tag.Tag}
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-5"
        >
          Save
        </Button>
      </form>
    </div>
  );
}
