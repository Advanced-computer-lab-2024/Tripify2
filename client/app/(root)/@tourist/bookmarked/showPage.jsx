"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { convertPrice } from "@/lib/utils";
import { RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";

const BookmarkedComponent = ({ params }) => {
  const { currency } = useCurrencyStore();

  const router = useRouter();

  const { itineraries, activities, touristId, bookmarked } = params;

  const { itinerariesBookmarked, activitiesBookmarked } = bookmarked;

  // console.log("------------------------------");
  // console.log(`itinerariesBookmarked: ${itinerariesBookmarked}`);
  // console.log(`activitiesBookmarked: ${activitiesBookmarked}`);
  // console.log("------------------------------");

  const [itineraryBookmarkedId, setItineraryBookmarkedId] = useState(
    itinerariesBookmarked
  );
  const [activityBookmarkedId, setActivityBookmarkedId] =
    useState(activitiesBookmarked);

  const itinerariesAppropriate = itineraries.filter(
    (itinerary) =>
      itineraryBookmarkedId.includes(itinerary._id) && !itinerary.Inappropriate
  );
  const activitiesAppropriate = activities.filter(
    (activity) =>
      activityBookmarkedId.includes(activity._id) && !activity.Inappropriate
  );

  const handleBookmark = (id, type) => {
    let updatedBookmarks;
    if (type === "itinerary") {
      setItineraryBookmarkedId((prev) => {
        updatedBookmarks = prev.filter((itemId) => itemId !== id);
        debounceSendPatchRequest(updatedBookmarks, "itinerary");
        return updatedBookmarks;
      });
    } else if (type === "activity") {
      setActivityBookmarkedId((prev) => {
        updatedBookmarks = prev.filter((itemId) => itemId !== id);
        debounceSendPatchRequest(updatedBookmarks, "activity");
        return updatedBookmarks;
      });
    }
  };

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debounceSendPatchRequest = debounce(async (updatedBookmarks, type) => {
    try {
      const body =
        type === "itinerary"
          ? { BookmarkedItinerary: updatedBookmarks }
          : { BookmarkedActivity: updatedBookmarks };

      await fetcher(`/tourists/${touristId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error("Error occurred while updating bookmarks:", e);
    }
  }, 300);

  return (
    <>
      {itineraryBookmarkedId.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {itinerariesAppropriate.map((itinerary) => {
            const isBookmarked = itineraryBookmarkedId.includes(itinerary._id); //not exactly needed, only for if lag occurs
            return (
              <button
                key={itinerary._id}
                className="relative text-left transition-shadow duration-200 rounded-lg hover:shadow-lg"
                onClick={() => router.push(`/itinerary/${itinerary._id}`)}
              >
                <img
                  src={itinerary.Image}
                  alt={itinerary.Name}
                  className="object-cover w-full h-32 mb-2 rounded-md"
                />
                <h3 className="text-lg font-medium">{itinerary.Name}</h3>
                <div
                  className="absolute top-2 right-2 text-2xl"
                  onClick={(e) => {
                    e.stopPropagation(); //prevent parent button click event listener from listening on clicking this child button
                    handleBookmark(itinerary._id, "itinerary");
                  }}
                >
                  {isBookmarked ? (
                    <RiBookmarkFill className="text-yellow-500" />
                  ) : (
                    <RiBookmarkLine className="text-gray-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <p>No itineraries available</p>
      )}

      <hr />

      {activityBookmarkedId.length > 0 ? (
        <>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {activitiesAppropriate.map((activity) => {
              const isBookmarked = activityBookmarkedId.includes(activity._id); //not exactly needed, only for if lag occurs
              // console.log(
              //   `id: ${typeof activity._id} isBookmarked: ${isBookmarked}`
              // );
              return (
                <button
                  key={activity._id}
                  className="relative w-full text-left transition-shadow duration-200 rounded-lg hover:shadow-lg"
                  onClick={() => router.push(`/activities/${activity._id}`)}
                >
                  <img
                    src={activity.Image}
                    alt={activity.Name}
                    className="object-cover w-full h-32 mb-2 rounded-md"
                  />
                  <p className="text-lg font-medium">{activity.Name}</p>
                  <p className="text-gray-500">
                    From:{" "}
                    {currency === "USD"
                      ? "$"
                      : currency === "EUR"
                      ? "€"
                      : "EGP"}{" "}
                    {convertPrice(activity.Price, currency)}
                  </p>
                  <div
                    className="absolute top-2 right-2 text-2xl"
                    onClick={(e) => {
                      e.stopPropagation(); //prevent parent button click event listener from listening on clicking this child button
                      handleBookmark(activity._id, "activity");
                    }}
                  >
                    {isBookmarked ? (
                      <RiBookmarkFill className="text-yellow-500" />
                    ) : (
                      <RiBookmarkLine className="text-gray-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No activities available.</p>
      )}
    </>
  );
};

export default BookmarkedComponent;
