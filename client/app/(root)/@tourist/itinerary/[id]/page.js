import SingleItinerary from "@/components/ui/SingleItineraryTourist";
import { getSession } from "@/lib/session";
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

  const session = await getSession();

  const touristId = session?.user?.id;

  const resTourist = await fetcher(`/tourists/${touristId}`).catch((e) =>
    console.log(e)
  );

  if (!resTourist?.ok) {
    const touristError = await resTourist.json();
    console.log(touristError);
    return <>error</>;
  }

  const tourist = await resTourist.json();

  const returnBookmarked = tourist.BookmarkedItinerary;

  const itinerary = await itineraryRes.json();

  return (
    <SingleItinerary itinerary={itinerary} bookmarked={returnBookmarked} />
  );
}
