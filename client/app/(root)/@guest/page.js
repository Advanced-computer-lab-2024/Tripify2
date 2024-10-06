import { fetcher } from "@/lib/fetch-client";
import ExploreGuest from "@/components/ui/exploreGuest";

export default async function ExplorePage() {
  const resItinerary = await fetcher(`/itineraries`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  const resActivity = await fetcher(`/activities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  const resPlace = await fetcher(`/places`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));

  if (!resItinerary?.ok || !resActivity?.ok || !resPlace?.ok) {
    return <>error</>;
  }

  const activities = await resActivity.json();
  const places = await resPlace.json();
  const itineraries = await resItinerary.json();

  const params = {
    itineraries,
    activities,
    places,
  };

  return <ExploreGuest params={params} />;
}
