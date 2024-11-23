import { getSession } from "@/lib/session";
import { fetcher } from "@/lib/fetch-client";
import ItineraryComponent from "./showPage";

export default async function AllItineraries() {
  const session = await getSession();

  const touristId = session.user.id;

  const resTourist = await fetcher(`/tourists/${touristId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));

  if (!resTourist?.ok) {
    const touristError = await resTourist.json();
    console.log(touristError);
    return <>error</>;
  }

  const tourist = await resTourist.json();

  const bookmarkedItinerariesTourist = tourist.BookmarkedItinerary;

  const params = { touristId, bookmarkedItinerariesTourist };

  return <ItineraryComponent params={params} />;
}
