"use client";
import React, { useState } from "react";
import Dashboard from "@/components/ui/dashboard";
import { useRouter } from "next/navigation";

export default function sellerProfile({ seller }) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    Name: seller.seller.UserId?.Name || "",
    Description: seller.seller.Description || "",
    Documents: seller.seller.Documents || "",
  });
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Test");
    console.log(formData);
    try {
      const response = await fetch(
        "http://localhost:3001/sellers/66f9b50c514bd05f1d3438b3",
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
        console.log("seller updated successfully:", result);
        //   setIsEditMode(false);
      } else {
        console.error("Error updating seller");
      }
    } catch (error) {
      console.error("Failed to update seller:", error);
    }
    router.refresh();
    setIsEditMode(false);
  };

  return (
    <div>
      <header>
        <Dashboard params={{ role: "Seller" }} />
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">seller Profile</h1>

          {isEditMode ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  <strong>Name:</strong>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
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
                  <strong>Description:</strong>
                  <input
                    type="text"
                    name="Description"
                    value={formData.Description}
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
                    name="Documents"
                    value={formData.Documents}
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
                <strong>Name:</strong> {seller.seller.UserId?.UserName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {seller.seller.UserId?.Email || "N/A"}
              </p>

              <p>
                <strong>Description:</strong> {seller.seller.Description}
              </p>
              <p>
                <strong>Document:</strong> {seller.seller.Document}
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
