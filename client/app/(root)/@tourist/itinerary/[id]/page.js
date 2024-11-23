import SingleItinerary from "@/components/ui/SingleItinerary";
import { fetcher } from "@/lib/fetch-client";

export default async function DetailsItinerary({ params }) {
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

  return <SingleItinerary itinerary={itinerary} />;
}
