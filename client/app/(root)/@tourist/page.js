import { fetcher } from "@/lib/fetch-client";
import { getSession } from "@/lib/session";
import Explore from "@/components/ui/explore";

export default async function ExplorePage() {
  const resItinerary = await fetcher(`/itineraries`).catch((e) =>
    console.log(e)
  );
  const resActivity = await fetcher(`/activities`).catch((e) => console.log(e));
  const resPlace = await fetcher(`/places`).catch((e) => console.log(e));

  if (!resItinerary?.ok) {
    const itinerariesError = await resItinerary.json();
    console.log(itinerariesError);
    return <>error</>;
  }
  if (!resActivity?.ok) {
    const activitiesError = await resActivity.json();
    console.log(activitiesError);
    return <>error</>;
  }
  if (!resPlace?.ok) {
    const placesError = await resPlace.json();
    console.log(placesError);
    return <>error</>;
  }

  const activities = await resActivity.json();
  const places = await resPlace.json();
  const itineraries = await resItinerary.json();

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

  // console.log("----------------------");
  // console.log(`touristId: ${touristId}`);
  // console.log(`tourist: ${tourist}`);
  // console.log(
  //   `${JSON.stringify(tourist.BookmarkedItinerary)} - ${JSON.stringify(
  //     tourist.BookmarkedActivity
  //   )}`
  // );
  // console.log("----------------------");

  const bookmarked = {
    itineraries: tourist.BookmarkedItinerary,
    activities: tourist.BookmarkedActivity,
  };

  const params = {
    itineraries,
    activities,
    places,
    bookmarked,
    touristId,
  };

  return <Explore params={params} />;
}
