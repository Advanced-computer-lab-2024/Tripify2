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
    <>
      <hr />
      <button
        className="w-full hover:bg-slate-50"
        onClick={() => redirectitinerary(itinerary._id)}
        key={itinerary._id}
      >
        <ItineraryCard
          itineraryid={itinerary._id}
          Name={itinerary.Name}
          Accessibility={itinerary.Accessibility}
          Image={itinerary.Image}
          StartDate={itinerary.StartDate}
          EndDate={itinerary.EndDate}
          Price={itinerary.Price}
          itinerary={itinerary}
        />
      </button>
    </>
  ));
  return (
    <div className="p-6">
      <div className="px-6 py-4 border-2 border-slate-200 rounded-md">
        <h1 className="text-2xl">
          <strong>My Itineraries</strong>
        </h1>
        <span className="text-slate-400">View your itineraries</span>
        <div className="mt-4">
          <ul className="grid grid-cols-[100px_300px_100px_300px_300px_100px] justify-items-start p-2 items-center">
            <li className="text-slate-600">Image</li>
            <li className="text-slate-600">Name</li>
            <li className="text-slate-600">Price</li>
            <li className="text-slate-600">Start Date</li>
            <li className="text-slate-600">End Date</li>
          </ul>
          {cards}
        </div>
      </div>
    </div>
  );
}
export default MyItinerariesPage;
