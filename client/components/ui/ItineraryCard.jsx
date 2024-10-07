"use client";
import React from "react";

function ItineraryCard({
  Activities,
  StartDate,
  EndDate,
  redirect,
  itineraryid,
}) {
  let counter = 0;
  const activityList = Activities.map((Activity) => {
    counter++;
    return (
      <li className="gap-1 flex flex-col items-start">
        <h2>Activity-{counter}</h2>
        <h2>Type: {Activity.type}</h2>
        <h4>Duration: {Activity.duration}</h4>

        {counter !== Activities.length && <hr className="w-full" />}
      </li>
    );
  });

  return (
    <button
      onClick={() => redirect(itineraryid)}
      className="rounded-md drop-shadow-md border border-black p-4 flex flex-row items-center gap-20"
    >
      <ul className="flex flex-col gap-2">{activityList}</ul>
      <div>
        <h3>Start Date: {StartDate}</h3>
        <h3>End Date: {EndDate}</h3>
      </div>
    </button>
  );
}

export default ItineraryCard;
