"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditActivity() {
  const [formData, setFormData] = useState({
    Name: "",
    Date: "",
    Time: "",
    Location: "",
    Price: "",
    SpecialDiscounts: "",
    Duration: "",
    Image: "",
  });
  const router = useRouter();
  const { id } = useParams(); // Getting the activity id from the URL

  // Fetch the existing activity data when component mounts
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`http://localhost:3001/activities/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Populate the form with the fetched data
          setFormData({
            Name: data.activity.Name,
            Date: data.activity.Date.split("T")[0], // Extracting just the date part
            Time: data.activity.Time,
            Location: data.activity.Location,
            Price: data.activity.Price,
            SpecialDiscounts: data.activity.SpecialDiscounts,
            Duration: data.activity.Duration,
            Image: data.activity.Image || "",
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission to save the changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
    try {
      const response = await fetch(`http://localhost:3001/activities/${id}`, {
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
        router.push("/MyActivities"); // Redirect back to activities list
      } else {
        alert("Failed to update the activity.");
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
              type="date"
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
            <input
              type="text"
              name="Location"
              value={formData.Location}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4"
              required
            />
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
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
