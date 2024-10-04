import ItineraryDetails from "@/components/ui/itineraryDetails";

export default async function Itinerary({ params }) {
  const { id } = params;
  const itineraryInfoResponse = await fetch(
    `http://localhost:3001/itineraries/${id}`, // Fetch using the correct id
    {
      cache: "no-store",
    }
  );

  if (!itineraryInfoResponse.ok) {
    throw new Error("Network response was not ok");
  }

  const itineraryInfo = await itineraryInfoResponse.json();

  return <ItineraryDetails params={{ itineraryInfo }} />; // Pass data to the component
}
