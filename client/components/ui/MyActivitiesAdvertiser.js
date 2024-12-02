"use client";
import React from "react";
import Dashboard from "@/components/ui/dashboard";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { Badge } from "@/components/ui/badge";
export default function AdvertiserProfile({ Activities }) {
  const AllActivities = Activities.Activities;
  const { currency } = useCurrencyStore();
  // console.log(Activities);
  const router = useRouter();

  const handleCreateClick = () => {
    router.push("/my-activities/createActivity");
  };

  const handleEditClick = (id) => {
    router.push(`/my-activities/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this activity?");
    if (confirmed) {
      try {
        const response = await fetcher(`/activities/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
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

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Activities</h1>
          <button
            onClick={handleCreateClick}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Create
          </button>
        </div>

        {AllActivities && AllActivities.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {AllActivities.map((activity) => (
              <Card
                key={activity._id}
                className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
              >
                <CardHeader>
                  <img
                    src={activity.Image}
                    alt={activity.Name}
                    className="object-cover w-full h-48 mb-2 rounded-lg"
                  />
                  <CardTitle className="text-lg font-bold">
                    {activity.Name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-black-600">
                    <p>
                      Price:{" "}
                      {currency === "USD"
                        ? "$"
                        : currency === "EUR"
                        ? "€"
                        : "EGP"}{" "}
                      {convertPrice(activity.Price, currency)}
                    </p>

                    <p>Date: {new Date(activity.Date).toLocaleDateString()}</p>
                    <div className="flex justify-between w-full py-2">
                      <button
                        onClick={() => handleEditClick(activity._id)}
                        className="bg-green-500 text-white py-2 px-3 rounded w-1/3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(activity._id)}
                        className="bg-red-500 text-white py-2 px-3 rounded w-1/3"
                      >
                        Delete
                      </button>
                    </div>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No activities found.</p>
        )}
      </div>
    </div>
  );
}
