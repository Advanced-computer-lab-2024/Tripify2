import { fetcher } from "@/lib/fetch-client";
import { getSession } from "@/lib/session";
import HelperTouristsReport from "./helperPage";

const Page = async () => {
  const session = await getSession();
  const advertiserId = session?.user?.id;
  //const advertiserId = "670438bc491256c6a75f10d4";

  const resActivities = await fetcher("/activities").catch((e) =>
    console.log(e)
  );

  if (!resActivities?.ok) {
    const activitiesError = await resActivities.json();
    console.log(activitiesError);
    return <>error</>;
  }

  const activities = await resActivities.json();

  const activitiesForThisAdvertiser = activities.filter((activity) => {
    return activity?.AdvertiserId?._id === advertiserId;
  });
  const idsActivitiesForThisAdvertiser = activitiesForThisAdvertiser.map(
    (activity) => activity?._id
  );

  const resAllBookings = await fetcher("/bookings/activ").catch((e) =>
    console.log(e)
  );

  if (!resAllBookings?.ok) {
    const allBookingsError = await resAllBookings.json();
    console.log(allBookingsError);
    return <>error</>;
  }

  const allBookings = await resAllBookings.json();

  const allBookingsForThisAdvertiser = allBookings.filter(
    (booking) =>
      idsActivitiesForThisAdvertiser.includes(booking?.ActivityId?._id) &&
      booking?.Status === "Confirmed"
  );

  const allActivitiesForThisAdvertiserWithNoBookings =
    activitiesForThisAdvertiser.filter(
      (activity) =>
        !allBookingsForThisAdvertiser.some(
          (booking) => booking?.ActivityId?._id === activity?._id
        )
    );

  const params = {
    activitiesWithBookings: allBookingsForThisAdvertiser,
    activitiesWithoutBookings: allActivitiesForThisAdvertiserWithNoBookings,
  };

  return <HelperTouristsReport params={params} />;
};

export default Page;
