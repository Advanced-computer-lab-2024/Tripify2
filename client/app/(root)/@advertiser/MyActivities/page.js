import MyActivitiesAdvertiser from "@/components/ui/MyActivitiesAdvertiser.js";

export default async function MyActivities() {
  const res = await fetch(
    "http://localhost:3001/activities/MyActivities/66fd00e5af33328b032193cf",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 0,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch advertiser data");
  }

  const Activities = await res.json();
  // console.log(Activities);

  return (
    <div>
      <MyActivitiesAdvertiser Activities={Activities} />
    </div>
  );
}
