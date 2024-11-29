import { getSession } from "@/lib/session";
import { fetcher } from "@/lib/fetch-client";
import BookmarkedComponent from "./showPage";

const BookmarkedData = async () => {
  const resItinerary = await fetcher("/itineraries").catch((e) =>
    console.log(e)
  );
  const resActivity = await fetcher("/activities").catch((e) => console.log(e));

  if (!resItinerary?.ok) {
    const itineraryError = await resItinerary.json();
    console.log(itineraryError);
    return <>error</>;
  }
  if (!resActivity?.ok) {
    const activityError = await resActivity.json();
    console.log(activityError);
    return <>error</>;
  }

  const itineraries = await resItinerary.json();
  const activities = await resActivity.json();

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

  const bookmarked = {
    itinerariesBookmarked: tourist.BookmarkedItinerary,
    activitiesBookmarked: tourist.BookmarkedActivity,
  };

  const params = { itineraries, activities, touristId, bookmarked };

  return <BookmarkedComponent params={params} />;
};

export default BookmarkedData;
