import sellerprofile from "@/components/ui/sellerprofile";
export default async function MyProfile() {
  const res = await fetch(
    "http://localhost:3001/sellers/66f9b50c514bd05f1d3438b3",
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
    throw new Error("Failed to fetch seller data");
  }

  const seller = await res.json();
  console.log(seller);

  return (
    <div>
      < sellerprofile seller={seller} />
    </div>
  );
}
