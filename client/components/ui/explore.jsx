"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiOutlineSearch,
} from "react-icons/ai";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { convertPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";
import { fetcher } from "@/lib/fetch-client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Explore({ params }) {
  const { currency } = useCurrencyStore();
  const { itineraries, activities, places, bookmarked, touristId } = params;
  const [search, setSearch] = useState("");
  const [currentItineraryIndex, setCurrentItineraryIndex] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [recordsToShow, setRecordsToShow] = useState(2);
  const [bookmarkedItinerary, setBookmarkedItinerary] = useState(
    bookmarked.itineraries
  );
  const [bookmarkedActivity, setBookmarkedActivity] = useState(
    bookmarked.activities
  );

  const router = useRouter();

  const filteredPlaces = places.length
    ? places.filter((place) =>
      place.Name.toLowerCase().includes(search.toLowerCase())
    )
    : [];
  const filteredItineraries = itineraries.length
    ? itineraries.filter((itinerary) =>
      itinerary.Name.toLowerCase().includes(search.toLowerCase())
    )
    : [];
  const filteredActivities = activities.length
    ? activities.filter((activity) =>
      activity.Name.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  const updateRecordsToShow = () => {
    const width = window.innerWidth;

    if (width >= 1024) {
      setRecordsToShow(10);
    } else if (width >= 768) {
      setRecordsToShow(6);
    } else {
      setRecordsToShow(1);
    }
  };

  useEffect(() => {
    updateRecordsToShow();
    window.addEventListener("resize", updateRecordsToShow);

    return () => {
      window.removeEventListener("resize", updateRecordsToShow);
    };
  }, []);

  const handleItineraryNext = () => {
    if (
      currentItineraryIndex + 1 <
      Math.ceil(filteredItineraries.length / recordsToShow)
    ) {
      setCurrentItineraryIndex((prev) => prev + 1);
    }
  };

  const handleItineraryPrev = () => {
    if (currentItineraryIndex > 0) {
      setCurrentItineraryIndex((prev) => prev - 1);
    }
  };

  const handleActivityNext = () => {
    if (
      currentActivityIndex + 1 <
      Math.ceil(filteredActivities.length / recordsToShow)
    ) {
      setCurrentActivityIndex((prev) => prev + 1);
    }
  };

  const handleActivityPrev = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex((prev) => prev - 1);
    }
  };

  const handlePlaceNext = () => {
    if (
      currentPlaceIndex + 1 <
      Math.ceil(filteredPlaces.length / recordsToShow)
    ) {
      setCurrentPlaceIndex((prev) => prev + 1);
    }
  };

  const handlePlacePrev = () => {
    if (currentPlaceIndex > 0) {
      setCurrentPlaceIndex((prev) => prev - 1);
    }
  };

  const getDisplayedItineraries = () => {
    const start = currentItineraryIndex * recordsToShow;
    return filteredItineraries.slice(start, start + recordsToShow);
  };

  const getDisplayedActivities = () => {
    const start = currentActivityIndex * recordsToShow;
    return filteredActivities.slice(start, start + recordsToShow);
  };

  const getDisplayedPlaces = () => {
    const start = currentPlaceIndex * recordsToShow;
    return filteredPlaces.slice(start, start + recordsToShow);
  };

  const handleBookmark = (id, type) => {
    let updatedBookmarks;
    if (type === "itinerary") {
      setBookmarkedItinerary((prev) => {
        updatedBookmarks = prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id];
        debounceSendPatchRequest(updatedBookmarks, "itinerary");
        return updatedBookmarks;
      });
    } else if (type === "activity") {
      setBookmarkedActivity((prev) => {
        updatedBookmarks = prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id];
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
      //console.log("---------------------");
      // console.log(`touristId: ${touristId}`);
      //console.log(`Bookmarked Itinerary: ${itineraries}`);
      //console.log(`Bookmarked Activity: ${activities}`);
      //console.log("---------------------");

      const body =
        type === "itinerary"
          ? { BookmarkedItinerary: updatedBookmarks }
          : { BookmarkedActivity: updatedBookmarks };

      await fetcher(`/tourists/${touristId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // console.log("=======================");
      // const data = await response.json();
      // console.log(`response: ${JSON.stringify(data)}`);
      // console.log("=======================");
    } catch (e) {
      console.error("Error occurred while updating bookmarks:", e);
    }
  }, 300);

  return (
    <div className="mx-20 mt-5 sm:mx-22 md:mx-24 lg:mx-26 xl:mx-30">
      <div className="w-full mb-6 text-white bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex flex-col items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:flex-row">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Plane className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Design Your Dream Getaway</h2>
              <p className="text-blue-100">
                Create a personalized vacation package tailored just for you
              </p>
            </div>
          </div>
          <Link href="/create-vacation">
            <Button id='start-vacation' className="flex items-center gap-2 px-6 py-2 font-semibold text-blue-600 transition-colors bg-white rounded-full hover:bg-blue-50">
              Start Planning
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative mb-8">
        <span
          className="absolute text-gray-500 transform -translate-y-1/2 left-2 top-1/2"
          style={{ fontSize: "25px" }}
        >
          <AiOutlineSearch />
        </span>
        <input
          type="text"
          placeholder="Where are you going?"
          className="w-full py-2 pl-10 pr-4 text-gray-700 transition duration-200 bg-gray-100 rounded-lg focus:outline-none focus:bg-white"
          style={{ border: "none", boxShadow: "none" }}
          value={search}
          id='search-bar'
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentItineraryIndex(0);
            setCurrentActivityIndex(0);
            setCurrentPlaceIndex(0);
          }}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="flex mb-6 space-x-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="places">Places</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <button
            className="mb-6 text-2xl font-semibold transition-all duration-300 hover:opacity-60 hover:filter hover:brightness-75"
            onClick={() => router.push("/itinerary")}
          >
            Itineraries ({filteredItineraries.length})
          </button>
          {filteredItineraries.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getDisplayedItineraries().map((itinerary) => {
                const isBookmarked = bookmarkedItinerary.includes(
                  itinerary._id
                );
                return (
                  <Card
                    key={itinerary._id}
                    className="relative transition-all duration-300 ease-in-out transform group hover:scale-101 hover:shadow-xl hover:bg-gray-100"
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
                        className="absolute text-2xl top-2 right-2"
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
            className="mb-6 text-2xl font-semibold transition-all duration-300 hover:opacity-60 hover:filter hover:brightness-75"
            onClick={() => router.push("/activities")}
          >
            Activities ({filteredActivities.length})
          </button>
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getDisplayedActivities().map((activity) => {
                const isBookmarked = bookmarkedActivity.includes(activity._id);
                return (
                  <Card
                    key={activity._id}
                    className="relative transition-all duration-300 ease-in-out transform group hover:scale-101 hover:shadow-xl hover:bg-gray-100"
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
                        className="absolute text-2xl top-2 right-2"
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

          <hr className="my-8 border-gray-300" />

          <button
            className="mb-6 text-2xl font-semibold transition-all duration-300 hover:opacity-60 hover:filter hover:brightness-75"
            onClick={() => router.push("/places")}
          >
            Places ({filteredPlaces.length})
          </button>
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getDisplayedPlaces().map((place) => (
                <Card
                  key={place._id}
                  className="relative transition-all duration-300 ease-in-out transform group hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                  onClick={() => router.push(`/places/${place._id}`)}
                >
                  <img
                    src={place.Pictures[0]}
                    alt={place.Name}
                    className="object-cover w-full h-32 mb-2 rounded-md"
                  />
                  <CardHeader>
                    <CardTitle>{place.Name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No places available.</p>
          )}
        </TabsContent>

        <TabsContent value="itineraries">
          <button
            className="mb-6 text-2xl font-semibold transition-all duration-300 hover:opacity-60 hover:filter hover:brightness-75"
            onClick={() => router.push("/itinerary")}
          >
            Itineraries ({filteredItineraries.length})
          </button>
          {filteredItineraries.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getDisplayedItineraries().map((itinerary) => {
                const isBookmarked = bookmarkedItinerary.includes(
                  itinerary._id
                );
                return (
                  <Card
                    key={itinerary._id}
                    className="relative transition-all duration-300 ease-in-out transform group hover:scale-101 hover:shadow-xl hover:bg-gray-100"
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
                        className="absolute text-2xl top-2 right-2"
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
            className="mb-6 text-2xl font-semibold transition-all duration-300 hover:opacity-60 hover:filter hover:brightness-75"
            onClick={() => router.push("/activities")}
          >
            Activities ({filteredActivities.length})
          </button>
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getDisplayedActivities().map((activity) => {
                const isBookmarked = bookmarkedActivity.includes(activity._id);
                return (
                  <Card
                    key={activity._id}
                    className="relative transition-all duration-300 ease-in-out transform group hover:scale-101 hover:shadow-xl hover:bg-gray-100"
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
                        className="absolute text-2xl top-2 right-2"
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

        <TabsContent value="places">
          <button
            className="mb-6 text-2xl font-semibold transition-all duration-300 hover:opacity-60 hover:filter hover:brightness-75"
            onClick={() => router.push("/places")}
          >
            Places ({filteredPlaces.length})
          </button>
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getDisplayedPlaces().map((place) => (
                <Card
                  key={place._id}
                  className="relative transition-all duration-300 ease-in-out transform group hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                  onClick={() => router.push(`/places/${place._id}`)}
                >
                  <img
                    src={place.Pictures[0]}
                    alt={place.Name}
                    className="object-cover w-full h-32 mb-2 rounded-md"
                  />
                  <CardHeader>
                    <CardTitle>{place.Name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No places available.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
