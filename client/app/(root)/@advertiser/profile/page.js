import MyProfileAdvertiser from "@/components/ui/MyProfileAdvertiser";
import { getSession } from "@/lib/session";
import { fetcher } from "@/lib/fetch-client";
export default async function MyProfile() {
  const Session = await getSession();
  // console.log(Session);
  const res = await fetcher(`/advertisers/${Session.user.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch advertiser data");
  }

  const advertiser = await res.json();
  // console.log(advertiser);

  console.log(advertiser)
  return (
    <div>
      <MyProfileAdvertiser advertiser={advertiser} />
    </div>
  );
}
