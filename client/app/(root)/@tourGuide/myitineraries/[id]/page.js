import ItineraryPage from "@/components/ui/ItineraryPage";
//import { useParams } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
export default async function Itinerary({ params }) {
  const { id } = params;

  const itineraryRes = await fetcher(`/itineraries/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));

  if (!itineraryRes.ok) {
    throw new Error("Network response was not ok");
  }

  const itinerary = await itineraryRes.json();

  return (
    <div>
      <ItineraryPage itinerary={itinerary} />
    </div>
  );
}
