"use client";
import React from "react";

function ItineraryCard({
  Image,
  Name,
  StartDate,
  EndDate,
  Accessibility,
  Price,
  itinerary
}) {
  return (
    <ul className="grid grid-cols-[100px_300px_100px_300px_300px_100px] justify-items-start p-2 items-center">
      <li className="w-16 h-16"><img src={(itinerary?.Image.startsWith('http') || itinerary?.Image.startsWith('https') || itinerary?.Image.startsWith('www') || itinerary?.Image.startsWith('i.') || itinerary?.Image.startsWith('m.')) ? itinerary?.Image : `/images/placeholder.jpg`}/></li>
      <li>{Name}</li>
      <li>${Price}</li>
      <li>{StartDate}</li>
      <li>{EndDate}</li>
      <li className="justify-self-center">{Accessibility ? "✔️" : "✖️"}</li>
    </ul>
  );
}

export default ItineraryCard;
