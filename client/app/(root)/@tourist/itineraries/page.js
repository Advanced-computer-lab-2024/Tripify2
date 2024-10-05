import TouristItineraries from "@/components/shared/touristItineraries";

export default async function Itineraries() {
  const response = await fetch("http://localhost:3001/itineraries", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    cache: "no-store",
  }).catch(e => {});
  if (!response?.ok) {
    return <>No Itineraries</>
  }
  const itineraries = await response.json();

  console.log(itineraries)

  return <TouristItineraries itineraries={itineraries} />;
}
