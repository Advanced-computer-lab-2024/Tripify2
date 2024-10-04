import TouristAccount from "@/components/ui/touristAccount";

export default async function Account({ params }) {
  const { id } = params;
  const touristInfoResponse = await fetch(
    `http://localhost:3001/tourists/${id}`, // Fetch using the correct id
    {
      cache: "no-store",
    }
  );

  if (!touristInfoResponse.ok) {
    throw new Error("Network response was not ok");
  }

  const touristInfo = await touristInfoResponse.json();

  return <TouristAccount params={{ touristInfo }} />; // Pass data to the component
}
