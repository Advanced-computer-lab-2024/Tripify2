import TouristItineraries from "@/components/shared/touristItineraries";

export default async function Itineraries() {
  const response = await fetch("http://localhost:3001/itineraries", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const itineraries = await response.json();

  return <TouristItineraries itineraries={itineraries} />;
}
