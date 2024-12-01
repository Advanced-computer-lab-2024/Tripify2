"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import { format } from "date-fns";

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

          setFormData({
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
          });
        } else {
          alert("Failed to fetch the activity.");
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };
    fetchActivity();
  }, [id]);

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
    <div className="p-6 max-w-3xl mx-auto">
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
              value={
                formData.Date
                  ? format(new Date(formData.Date), "yyyy-MM-dd")
                  : ""
              }
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
              value={
                formData.Time
                  ? format(new Date(formData.Time), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
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
            <strong>Image:</strong>
            <input
              type="text"
              name="Image"
              value={formData.Image}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4"
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
                  checked={
                    formData.CategoryId
                      ? formData.CategoryId.includes(category._id)
                      : false
                  }
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
                  checked={
                    formData.Tags ? formData.Tags.includes(tag._id) : false
                  }
                  onChange={handleTagChange}
                />
                {tag.Tag}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-5"
        >
          Save
        </button>
      </form>
    </div>
  );
}
