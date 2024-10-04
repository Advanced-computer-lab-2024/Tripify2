import MyProfileAdvertiser from "@/components/ui/MyProfileAdvertiser.js";

export default async function MyProfile() {
  const res = await fetch(
    "http://localhost:3001/advertisers/66fd00e5af33328b032193cf",
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

  const advertiser = await res.json();
  console.log(advertiser);

  return (
    <div>
      <MyProfileAdvertiser advertiser={advertiser} />
    </div>
  );
}
