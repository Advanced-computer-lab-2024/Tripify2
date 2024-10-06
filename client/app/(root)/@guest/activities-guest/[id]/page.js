import SingleActivity from "@/components/ui/SingleActivity";
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

  const activity = await activityRes.json();
  const returnActivity = activity.activity;

  return <SingleActivity activity={returnActivity} />;
}
