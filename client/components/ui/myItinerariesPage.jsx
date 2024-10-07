"use client";
import React from "react";
import ItineraryCard from "./itineraryCard";
import { useRouter } from "next/navigation";

function MyItinerariesPage({ Itineraries }) {
  const router = useRouter();
  function redirectitinerary(id) {
    router.push(`/myitineraries/${id}`);
  }
  const AllItineraries = Itineraries;

  const cards = AllItineraries.map((itinerary) => (
    <ItineraryCard
      itineraryid={itinerary._id}
      redirect={redirectitinerary}
      Activities={itinerary.Activities}
      StartDate={itinerary.StartDate}
      EndDate={itinerary.EndDate}
    />
  ));
  return (
    <div className="p-10 grid grid-cols-1 gap-4 w-fit">
      <h1 className="text-2xl">
        <strong>My Itineraries</strong>
      </h1>
      {cards}
    </div>
  );
}
export default MyItinerariesPage;
