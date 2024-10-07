"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import { useSession } from "next-auth/react";
export default function CreateActivity() {
  const session = useSession();
  const id = session?.data?.user?.id;
  console.log(id);
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
    Rating: "",
  });

  const [categories, setCategories] = useState([]); // Available categories
  const [tags, setTags] = useState([]); // Available tags

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
    console.log(JSON.stringify(formData));
    try {
      const response = await fetcher("/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Activity</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Name:</strong>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4"
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
              value={formData.Date}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4"
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
              value={formData.Time}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Location:</strong>
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </label>
        </div>
        <div>
          <label>
            <strong>Price:</strong>
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Rating:</strong>
            <input
              type="number"
              name="Rating"
              value={formData.Rating}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4"
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
              className="border p-2 w-full mb-4"
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
              className="border p-2 w-full mb-4"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Image (URL or Base64):</strong>
            <input
              type="text"
              name="Image"
              value={formData.Image}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4"
              placeholder="Enter image URL or Base64 string"
              required
            />
          </label>
          <img src={formData.Image} alt="Image" className="w-[300px] p-3"></img>
        </div>
        <div>
          <strong>Categories:</strong>
          {categories.map((category) => (
            <div key={category._id}>
              <label>
                <input
                  type="checkbox"
                  value={category._id}
                  checked={formData.Categories.includes(category._id)}
                  onChange={handleCategoryChange}
                />
                {category.Category}
              </label>
            </div>
          ))}
        </div>
        <div>
          <strong>Tags:</strong>
          {tags.map((tag) => (
            <div key={tag._id}>
              <label>
                <input
                  type="checkbox"
                  value={tag._id}
                  checked={formData.Tags.includes(tag._id)}
                  onChange={handleTagChange}
                />
                {tag.Tag}
              </label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
