"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function CreateActivity() {
  const session = useSession();
  const id = session?.data?.user?.id;
  //console.log(id);
  const [formData, setFormData] = useState({
    Name: "",
    Date: "",
    Time: "",
    Location: null,
    Price: "",
    SpecialDiscounts: "",
    Duration: "",
    Image: "",
    Categories: [],
    Tags: [],
    AdvertiserId: id,
  });

  const [categories, setCategories] = useState([]); // Available categories
  const [tags, setTags] = useState([]); // Available tags
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const router = useRouter();

  // Fetch categories and tags from API when the component mounts
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
  }, []);

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
      ? [...formData.Categories, value]
      : formData.Categories.filter((category) => category !== value);

    setFormData({
      ...formData,
      Categories: updatedCategories,
    });
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

  // Handle location selection from LocationPicker
  const handleLocationSelect = (location) => {
    setFormData((formData) => ({
      ...formData,
      Location: location,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(JSON.stringify(formData));
    //console.log(`session: ${JSON.stringify(session?.data?.user?.id)}`);
    const toSend = { ...formData, AdvertiserId: session?.data?.user?.id };
    try {
      const response = await fetcher("/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend),
      });

      if (response.ok) {
        alert("Successfully created an activity");
        router.push("/my-activities");
      } else {
        console.error("Error creating activity");
      }
    } catch (error) {
      console.error("Failed to create activity:", error);
    }
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

  return (
    <div className="max-w-4xl mx-auto p-6 rounded m-4">
      <h1 className="text-2xl font-bold mb-4">Create Activity</h1>
      <form onSubmit={handleSubmit}>
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
        <label>
          <strong>Date:</strong>
          <input
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleInputChange}
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
            required
          />
        </label>
        <label>
          <strong>Time:</strong>
          <input
            type="datetime-local"
            name="Time"
            value={formData.Time}
            onChange={handleInputChange}
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
            required
          />
        </label>
        <label>
          <strong>Location:</strong>
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </label>
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
        <label>
          <strong>Image:</strong>
          <input
            type="text"
            name="Image"
            value={formData.Image}
            onChange={handleInputChange}
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
            placeholder="Enter image URL or Base64 string"
            required
          />
        </label>
        <img src={formData.Image} alt="Image" className="w-[300px] p-3"></img>

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

        {/* <strong>Categories:</strong>
          {categories.map((category) => (
            <div key={category._id}>
              <label>
                <input
                  type="checkbox"
                  value={category._id}
                  checked={formData.Categories.includes(category._id)}
                  onChange={handleCategoryChange}
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                />
                {category.Category}
              </label>
            </div>
          ))} */}

        {/* <strong>Tags:</strong>
          {tags.map((tag) => (
            <div key={tag._id}>
              <label>
                <input
                  type="checkbox"
                  value={tag._id}
                  checked={formData.Tags.includes(tag._id)}
                  onChange={handleTagChange}
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                />
                {tag.Tag}
              </label>
            </div>
          ))} */}
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
          className="text-white py-2 px-4 rounded w-full mt-2"
        >
          Create Activity
        </Button>
      </form>
    </div>
  );
}
