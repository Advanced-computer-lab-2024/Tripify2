import TouristAccount from "@/components/ui/touristAccount";
import { fetcher } from "@/lib/fetch-client";

export default async function Account({ params }) {
  const { id } = params;
  // const Session = await getSession();
  //`/tourists/${Session.user.UserId}`

  const touristInfoResponse = await fetcher(`/tourists/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));

  if (!touristInfoResponse.ok) {
    throw new Error("Network response was not ok");
  }

  const touristInfo = await touristInfoResponse.json();

  return <TouristAccount params={{ touristInfo }} />; // Pass data to the component
}
