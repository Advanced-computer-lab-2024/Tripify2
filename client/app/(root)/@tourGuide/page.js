"use client";
import Dashboard from "@/components/ui/dashboard";
import React from "react";
import { useRouter } from "next/navigation";

function LandingPage() {
  const router = useRouter();
  const myProfileClick = () => {
    router.push("/myprofile");
  };
  const myItinerariesClick = () => {
    router.push("/myitineraries");
  };
  const myCreateClick = () => {
    router.push("/createitinerary");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">
        <strong>Welcome Touguide</strong>
      </h1>
      <div>
        <button
          onClick={myProfileClick}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
        >
          My Profile
        </button>
        <button
          onClick={myItinerariesClick}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
        >
          My Itineraries
        </button>
        <button
          onClick={myCreateClick}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Create Itinerary
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
