"use client";
import React, { useState } from "react";
import Dashboard from "@/components/ui/dashboard";
import { useRouter } from "next/navigation";

export default function AdvertiserProfile({ advertiser }) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false); // Track if we're in edit mode
  const [formData, setFormData] = useState({
    UserName: advertiser.advertiser.UserId?.UserName || "",
    Email: advertiser.advertiser.UserId?.Email || "",
    Website: advertiser.advertiser.Website || "",
    Hotline: advertiser.advertiser.Hotline || "",
    Profile: advertiser.advertiser.Profile || "",
    Document: advertiser.advertiser.Document || "",
  });

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // Handle form inputs change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Submit the updated data to the backend
    console.log("Test");
    console.log(formData);
    try {
      const response = await fetch(
        "http://localhost:3001/advertisers/66fd00e5af33328b032193cf",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          next: {
            revalidate: 0,
          },
        }
      );

      // console.log(response);

      if (response.ok) {
        const result = await response.json();
        console.log("Advertiser updated successfully:", result);
        //   setIsEditMode(false);
      } else {
        console.error("Error updating advertiser");
      }
    } catch (error) {
      console.error("Failed to update advertiser:", error);
    }
    router.refresh();
    setIsEditMode(false);
  };

  return (
    <div>
      <header>
        <Dashboard params={{ role: "Advertiser" }} />
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Advertiser Profile</h1>

          {isEditMode ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  <strong>Name:</strong>
                  <input
                    type="text"
                    name="UserName"
                    value={formData.UserName}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Email:</strong>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Website:</strong> {/* Moved Website field here */}
                  <input
                    type="text"
                    name="Website"
                    value={formData.Website}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Hotline:</strong>
                  <input
                    type="text"
                    name="Hotline"
                    value={formData.Hotline}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Profile:</strong>
                  <input
                    type="text"
                    name="Profile"
                    value={formData.Profile}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Document:</strong>
                  <input
                    type="text"
                    name="Document"
                    value={formData.Document}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
              >
                Save
              </button>
            </form>
          ) : (
            <div>
              <p>
                <strong>Name:</strong>{" "}
                {advertiser.advertiser.UserId?.UserName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {advertiser.advertiser.UserId?.Email || "N/A"}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                {advertiser.advertiser.Website || "N/A"}{" "}
                {/* Display the Website */}
              </p>
              <p>
                <strong>Hotline:</strong> {advertiser.advertiser.Hotline}
              </p>
              <p>
                <strong>Profile:</strong> {advertiser.advertiser.Profile}
              </p>
              <p>
                <strong>Document:</strong> {advertiser.advertiser.Document}
              </p>

              <button
                onClick={handleEditClick}
                className="bg-yellow-500 text-white py-2 px-4 mt-4 rounded"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
