import SingleActivity from "@/components/ui/SingleActivityTourist";
import { getSession } from "@/lib/session";
import { fetcher } from "@/lib/fetch-client";

export default async function DetailsActivity({ params }) {
  const { id } = params;

  const activityRes = await fetcher(`/activities/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));

  if (!activityRes.ok) {
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

  const returnBookmarked = tourist.BookmarkedActivity;

  const activity = await activityRes.json();
  const returnActivity = activity.activity;

  return (
    <SingleActivity activity={returnActivity} bookmarked={returnBookmarked} />
  );
}
