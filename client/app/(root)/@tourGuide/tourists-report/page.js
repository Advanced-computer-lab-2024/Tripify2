import { fetcher } from "@/lib/fetch-client";
import { getSession } from "@/lib/session";
import HelperTouristsReport from "./helperPage";

const Page = async () => {
  const session = await getSession();
  const tourGuideId = session?.user?.id;

  const resItineraries = await fetcher("/itineraries").catch((e) =>
    console.log(e)
  );

  if (!resItineraries?.ok) {
    const itinerariesError = await resItineraries.json();
    console.log(itinerariesError);
    return <>error</>;
  }

  const itineraries = await resItineraries.json();

  const itinerariesForThisTourguide = itineraries.filter(
    (itinerary) => itinerary?.TourGuide?._id === tourGuideId
  );
  const idsItinerariesForThisTourguide = itinerariesForThisTourguide.map(
    (itinerary) => itinerary?._id
  );

  const resAllBookings = await fetcher("/bookings/itin").catch((e) =>
    console.log(e)
  );

  if (!resAllBookings?.ok) {
    const allBookingsError = await resAllBookings.json();
    console.log(allBookingsError);
    return <>error</>;
  }

  const allBookings = await resAllBookings.json();

  const allBookingsForThisTourguide = allBookings.filter(
    (booking) =>
      idsItinerariesForThisTourguide.includes(booking?.ItineraryId?._id) &&
      booking?.Status === "Confirmed"
  );
  const allItinerariesForThisTourguideWithNoBookings =
    itinerariesForThisTourguide.filter(
      (itinerary) =>
        !allBookingsForThisTourguide.some(
          (booking) => booking?.ItineraryId?._id === itinerary?._id
        )
    );

  const params = {
    itinerariesWithBookings: allBookingsForThisTourguide,
    itinerariesWithoutBookings: allItinerariesForThisTourguideWithNoBookings,
  };

  return <HelperTouristsReport params={params} />;
};

export default Page;
