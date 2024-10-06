"use client";
import React from "react";
import Dashboard from "@/components/ui/dashboard";
import { useRouter } from "next/navigation";

export default function AdvertiserProfile({ Activities }) {
  const AllActivities = Activities.activities;
  const router = useRouter();

  const handleCreateClick = () => {
    router.push("/MyActivities/createActivity");
  };

  const handleEditClick = (id) => {
    router.push(`/MyActivities/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this activity?");
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:3001/activities/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Activity deleted successfully!");
          router.refresh();
        } else {
          alert("Failed to delete the activity.");
        }
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert("An error occurred while deleting the activity.");
      }
    }
  };

  return (
    <div>
      <header>
        <Dashboard params={{ role: "Advertiser" }} />
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Activities</h1>

          <button
            onClick={handleCreateClick}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Create
          </button>
        </div>

        <ul className="list-disc">
          {AllActivities && AllActivities.length > 0 ? (
            AllActivities.map((activity) => {
              return (
                <li
                  key={activity._id}
                  className="mb-4 p-4 bg-white shadow rounded-lg"
                >
                  <p>
                    <strong>Name:</strong> {activity.Name}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(activity.Date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Price:</strong> ${activity.Price}
                  </p>

                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleEditClick(activity._id)}
                      className="bg-green-500 text-white py-1 px-3 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(activity._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <p>No activities found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
