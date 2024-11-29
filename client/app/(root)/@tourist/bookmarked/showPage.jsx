"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { convertPrice } from "@/lib/utils";
import { RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="mx-20 mt-5 sm:mx-22 md:mx-24 lg:mx-26 xl:mx-30">
      <Tabs defaultValue="all">
        <TabsList className="flex space-x-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/itinerary")}
          >
            Itineraries ({itinerariesAppropriate.length})
          </button>
          {itineraryBookmarkedId.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
              {itinerariesAppropriate.map((itinerary) => {
                const isBookmarked = itineraryBookmarkedId.includes(
                  itinerary._id
                );
                return (
                  <Card
                    key={itinerary._id}
                    className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                    onClick={() => router.push(`/itinerary/${itinerary._id}`)}
                  >
                    <img
                      src={itinerary.Image}
                      alt={itinerary.Name}
                      className="object-cover w-full h-32 mb-2 rounded-md"
                    />
                    <CardHeader>
                      <CardTitle>{itinerary.Name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="absolute top-2 right-2 text-2xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(itinerary._id, "itinerary");
                        }}
                      >
                        {isBookmarked ? (
                          <RiBookmarkFill className="text-yellow-500" />
                        ) : (
                          <RiBookmarkLine className="text-gray-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No itineraries available.</p>
          )}

          <hr className="my-8 border-gray-300" />

          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/activities")}
          >
            Activities ({activitiesAppropriate.length})
          </button>
          {activityBookmarkedId.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
              {activitiesAppropriate.map((activity) => {
                const isBookmarked = activityBookmarkedId.includes(
                  activity._id
                );
                return (
                  <Card
                    key={activity._id}
                    className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                    onClick={() => router.push(`/activities/${activity._id}`)}
                  >
                    <img
                      src={activity.Image}
                      alt={activity.Name}
                      className="object-cover w-full h-32 mb-2 rounded-md"
                    />
                    <CardHeader>
                      <CardTitle>{activity.Name}</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                          e.stopPropagation();
                          handleBookmark(activity._id, "activity");
                        }}
                      >
                        {isBookmarked ? (
                          <RiBookmarkFill className="text-yellow-500" />
                        ) : (
                          <RiBookmarkLine className="text-gray-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No activities available.</p>
          )}
        </TabsContent>

        <TabsContent value="itineraries">
          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/itinerary")}
          >
            Itineraries ({itinerariesAppropriate.length})
          </button>
          {itineraryBookmarkedId.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
              {itinerariesAppropriate.map((itinerary) => {
                const isBookmarked = itineraryBookmarkedId.includes(
                  itinerary._id
                );
                return (
                  <Card
                    key={itinerary._id}
                    className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                    onClick={() => router.push(`/itinerary/${itinerary._id}`)}
                  >
                    <img
                      src={itinerary.Image}
                      alt={itinerary.Name}
                      className="object-cover w-full h-32 mb-2 rounded-md"
                    />
                    <CardHeader>
                      <CardTitle>{itinerary.Name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="absolute top-2 right-2 text-2xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(itinerary._id, "itinerary");
                        }}
                      >
                        {isBookmarked ? (
                          <RiBookmarkFill className="text-yellow-500" />
                        ) : (
                          <RiBookmarkLine className="text-gray-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No itineraries available.</p>
          )}
        </TabsContent>

        <TabsContent value="activities">
          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/activities")}
          >
            Activities ({activitiesAppropriate.length})
          </button>
          {activityBookmarkedId.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
              {activitiesAppropriate.map((activity) => {
                const isBookmarked = activityBookmarkedId.includes(
                  activity._id
                );
                return (
                  <Card
                    key={activity._id}
                    className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                    onClick={() => router.push(`/activities/${activity._id}`)}
                  >
                    <img
                      src={activity.Image}
                      alt={activity.Name}
                      className="object-cover w-full h-32 mb-2 rounded-md"
                    />
                    <CardHeader>
                      <CardTitle>{activity.Name}</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                          e.stopPropagation();
                          handleBookmark(activity._id, "activity");
                        }}
                      >
                        {isBookmarked ? (
                          <RiBookmarkFill className="text-yellow-500" />
                        ) : (
                          <RiBookmarkLine className="text-gray-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No activities available.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookmarkedComponent;
