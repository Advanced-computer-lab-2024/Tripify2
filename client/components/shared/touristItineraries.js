"use client";
export default function TouristItineraries({ itineraries }) {
  return (
    <div>
      {itineraries.map((eachItinerary) => {
        return <h1 key={eachItinerary._id}>{eachItinerary._id}</h1>; // Use return here
      })}
    </div>
  );
}
