import MyItinerariesPage from "@/components/ui/myItinerariesPage";
import { fetcher } from "@/lib/fetch-client";

export default async function MyItineraries() {
  const getitineraries = await fetcher("/itineraries/get-all/my-itineraries", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!getitineraries?.ok) {
    console.log("err");
  }

  const itineraries = await getitineraries.json();

  return (
    <div>
      <MyItinerariesPage Itineraries={itineraries} />
    </div>
  );
}
