"use client";
import Dashboard from "@/components/ui/dashboard";
import React from "react";
import { useRouter } from "next/navigation";
import LogoutBtn from "@/components/ui/LogoutBtn";

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
  const myReportClick = () => {
    router.push("/sales-report");
  };
  return (
    <div className="p-10">
      <h1 className="mb-4 text-2xl">
        <strong>Welcome Touguide</strong>
      </h1>
      <div>
        <button
          onClick={myProfileClick}
          className="px-4 py-2 mr-4 text-white bg-blue-500 rounded"
        >
          My Profile
        </button>
        <button
          onClick={myItinerariesClick}
          className="px-4 py-2 mr-4 text-white bg-blue-500 rounded"
        >
          My Itineraries
        </button>
        <button
          onClick={myCreateClick}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Create Itinerary
        </button>
        <button
          onClick={myReportClick}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
         View Sales Report
        </button>
        <LogoutBtn />
      </div>
    </div>
  );
}

export default LandingPage;
