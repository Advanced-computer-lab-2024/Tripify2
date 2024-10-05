import Explore from "@/components/ui/explore";

export default async function ExplorePage() {
  const resItinerary = await fetch(`http://localhost:3001/itineraries`, {
    cache: "no-store",
  }).catch(e => console.log(e));
  const resActivity = await fetch(`http://localhost:3001/activities`, {
    cache: "no-store",
  }).catch(e => console.log(e));
  const resPlace = await fetch(`http://localhost:3001/places`, {
    cache: "no-store",
  }).catch(e => console.log(e));

  if (!resItinerary?.ok || !resActivity?.ok || !resPlace?.ok) {
    // throw new Error("Network response was not ok");
    return <>error</>
  }

  const itineraries = await resItinerary.json();
  const activities = await resActivity.json();
  const places = await resPlace.json();

  const params = {
    itineraries,
    activities,
    places,
  };

  return <Explore params={params} />;
}
