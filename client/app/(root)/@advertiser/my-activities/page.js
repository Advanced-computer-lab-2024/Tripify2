import MyActivitiesAdvertiser from "@/components/ui/MyActivitiesAdvertiser.js";
import { getSession } from "@/lib/session";
import { fetcher } from "@/lib/fetch-client";

export default async function MyActivities() {
  const res = await fetcher(`/advertisers/get-all/my-activities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 0,
    },
  }).catch((e) => console.log(e));
  if (!res?.ok) {
    console.log("err");
  }

  const Activities = await res.json();
  // console.log(Activities);

  return (
    <div>
      <MyActivitiesAdvertiser Activities={Activities} />
    </div>
  );
}
