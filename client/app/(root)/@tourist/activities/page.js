import { getSession } from "@/lib/session";
import { fetcher } from "@/lib/fetch-client";
import ActivityComponent from "./showPage";

export default async function AllActivities() {
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

  const bookmarkedActivitiesTourist = tourist.BookmarkedActivity;

  // console.log(
  //   `-----------------------------------------${bookmarkedActivitiesTourist}-------------------------------------`
  // );

  const params = { touristId, bookmarkedActivitiesTourist };

  return <ActivityComponent params={params} />;
}
