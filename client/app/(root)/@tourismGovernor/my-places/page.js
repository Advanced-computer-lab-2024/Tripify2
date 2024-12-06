import { fetcher } from "@/lib/fetch-client";
import { getSession } from "@/lib/session";
import MyPlaces from "./showPage";

const Page = async () => {
  const session = await getSession();

  //console.log(`session: ${JSON.stringify(session)}`);

  const tourismGovernorId = session?.user?.id;

  //console.log(`tourismGovernorId: ${tourismGovernorId}`);
  //6704f0ae8eb50e6de0f17472 id
  //6704f0ae8eb50e6de0f17470 userId

  const resPlaces = await fetcher("/places");

  if (!resPlaces?.ok) {
    const placesError = await resPlaces.json();
    console.log(placesError);
    return <>error</>;
  }

  const places = await resPlaces.json();

  const myPlaces = places.filter((place) => {
    //console.log(`place?.TourismGovernor: ${place?.TourismGovernor}`);
    return place?.TourismGovernor === tourismGovernorId;
  });

  //console.log(`myPlaces FE: ${JSON.stringify(myPlaces)}`);

  return <MyPlaces myPlaces={myPlaces} />;
};

export default Page;
