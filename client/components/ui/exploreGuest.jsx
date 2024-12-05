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

export default function ExploreGuest({ params }) {
  const { currency } = useCurrencyStore();

  const { itineraries, activities, places } = params;
  const [search, setSearch] = useState("");
  const [currentItineraryIndex, setCurrentItineraryIndex] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [recordsToShow, setRecordsToShow] = useState(2);

  const router = useRouter();

  const filteredPlaces = places.length
    ? places.filter((place) =>
        place.Name.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  const filteredItinerariesBefore = itineraries.length
    ? itineraries.filter((itinerary) =>
        itinerary.Name.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  const filteredItineraries = filteredItinerariesBefore.filter(
    (itinerary) => !itinerary?.Inappropriate
  );
  const filteredActivitiesBefore = activities.length
    ? activities.filter((activity) =>
        activity.Name.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  const filteredActivities = filteredActivitiesBefore.filter(
    (activity) => !activity?.Inappropriate
  );

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

  return (
    <div className="mx-20 mt-5 sm:mx-22 md:mx-24 lg:mx-26 xl:mx-30">
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
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentItineraryIndex(0);
            setCurrentActivityIndex(0);
            setCurrentPlaceIndex(0);
          }}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="flex space-x-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="places">Places</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/itineraries-guest")}
          >
            Itineraries ({filteredItineraries.length})
          </button>
          {filteredItineraries.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
                {getDisplayedItineraries().map((itinerary) => {
                  return (
                    <Card
                      key={itinerary._id}
                      className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                      onClick={() =>
                        router.push(`/itineraries-guest/${itinerary._id}`)
                      }
                    >
                      <img
                        src={itinerary.Image}
                        alt={itinerary.Name}
                        className="object-cover w-full h-32 mb-2 rounded-md"
                      />
                      <CardHeader>
                        <CardTitle>{itinerary.Name}</CardTitle>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-between my-4">
                <button
                  onClick={handleItineraryPrev}
                  disabled={currentItineraryIndex === 0}
                  className={`flex items-center text-gray-600 ${
                    currentItineraryIndex === 0
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowLeft />
                </button>
                <button
                  onClick={handleItineraryNext}
                  disabled={
                    currentItineraryIndex + 1 >=
                    Math.ceil(filteredItineraries.length / recordsToShow)
                  }
                  className={`flex items-center text-gray-600 ${
                    currentItineraryIndex + 1 >=
                    Math.ceil(filteredItineraries.length / recordsToShow)
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowRight />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No itineraries available.</p>
          )}

          <hr className="my-8 border-gray-300" />

          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/activities-guest")}
          >
            Activities ({filteredActivities.length})
          </button>
          {filteredActivities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
                {getDisplayedActivities().map((activity) => {
                  return (
                    <Card
                      key={activity._id}
                      className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                      onClick={() =>
                        router.push(`/activities-guest/${activity._id}`)
                      }
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-between my-4">
                <button
                  onClick={handleActivityPrev}
                  disabled={currentActivityIndex === 0}
                  className={`flex items-center text-gray-600 ${
                    currentActivityIndex === 0
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowLeft />
                </button>
                <button
                  onClick={handleActivityNext}
                  disabled={
                    currentActivityIndex + 1 >=
                    Math.ceil(filteredActivities.length / recordsToShow)
                  }
                  className={`flex items-center text-gray-600 ${
                    currentActivityIndex + 1 >=
                    Math.ceil(filteredActivities.length / recordsToShow)
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowRight />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No activities available.</p>
          )}

          <hr className="my-8 border-gray-300" />

          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/places-guest")}
          >
            Places ({filteredPlaces.length})
          </button>
          {filteredPlaces.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
                {getDisplayedPlaces().map((place) => (
                  <Card
                    key={place._id}
                    className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                    onClick={() => router.push(`/places-guest/${place._id}`)}
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
              <div className="flex justify-between my-4">
                <button
                  onClick={handlePlacePrev}
                  disabled={currentPlaceIndex === 0}
                  className={`flex items-center text-gray-600 ${
                    currentPlaceIndex === 0
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowLeft />
                </button>
                <button
                  onClick={handlePlaceNext}
                  disabled={
                    currentPlaceIndex + 1 >=
                    Math.ceil(filteredPlaces.length / recordsToShow)
                  }
                  className={`flex items-center text-gray-600 ${
                    currentPlaceIndex + 1 >=
                    Math.ceil(filteredPlaces.length / recordsToShow)
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowRight />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No places available.</p>
          )}
        </TabsContent>

        <TabsContent value="itineraries">
          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/itineraries-guest")}
          >
            Itineraries ({filteredItineraries.length})
          </button>
          {filteredItineraries.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
                {getDisplayedItineraries().map((itinerary) => {
                  return (
                    <Card
                      key={itinerary._id}
                      className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                      onClick={() =>
                        router.push(`/itineraries-guest/${itinerary._id}`)
                      }
                    >
                      <img
                        src={itinerary.Image}
                        alt={itinerary.Name}
                        className="object-cover w-full h-32 mb-2 rounded-md"
                      />
                      <CardHeader>
                        <CardTitle>{itinerary.Name}</CardTitle>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-between my-4">
                <button
                  onClick={handleItineraryPrev}
                  disabled={currentItineraryIndex === 0}
                  className={`flex items-center text-gray-600 ${
                    currentItineraryIndex === 0
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowLeft />
                </button>
                <button
                  onClick={handleItineraryNext}
                  disabled={
                    currentItineraryIndex + 1 >=
                    Math.ceil(filteredItineraries.length / recordsToShow)
                  }
                  className={`flex items-center text-gray-600 ${
                    currentItineraryIndex + 1 >=
                    Math.ceil(filteredItineraries.length / recordsToShow)
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowRight />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No itineraries available.</p>
          )}
        </TabsContent>

        <TabsContent value="activities">
          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/activities-guest")}
          >
            Activities ({filteredActivities.length})
          </button>
          {filteredActivities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
                {getDisplayedActivities().map((activity) => {
                  return (
                    <Card
                      key={activity._id}
                      className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                      onClick={() =>
                        router.push(`/activities-guest/${activity._id}`)
                      }
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-between my-4">
                <button
                  onClick={handleActivityPrev}
                  disabled={currentActivityIndex === 0}
                  className={`flex items-center text-gray-600 ${
                    currentActivityIndex === 0
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowLeft />
                </button>
                <button
                  onClick={handleActivityNext}
                  disabled={
                    currentActivityIndex + 1 >=
                    Math.ceil(filteredActivities.length / recordsToShow)
                  }
                  className={`flex items-center text-gray-600 ${
                    currentActivityIndex + 1 >=
                    Math.ceil(filteredActivities.length / recordsToShow)
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowRight />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No activities available.</p>
          )}
        </TabsContent>

        <TabsContent value="places">
          <button
            className="text-2xl font-semibold mb-6 hover:opacity-60 hover:filter hover:brightness-75 transition-all duration-300"
            onClick={() => router.push("/places-guest")}
          >
            Places ({filteredPlaces.length})
          </button>
          {filteredPlaces.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
                {getDisplayedPlaces().map((place) => (
                  <Card
                    key={place._id}
                    className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
                    onClick={() => router.push(`/places-guest/${place._id}`)}
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
              <div className="flex justify-between my-4">
                <button
                  onClick={handlePlacePrev}
                  disabled={currentPlaceIndex === 0}
                  className={`flex items-center text-gray-600 ${
                    currentPlaceIndex === 0
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowLeft />
                </button>
                <button
                  onClick={handlePlaceNext}
                  disabled={
                    currentPlaceIndex + 1 >=
                    Math.ceil(filteredPlaces.length / recordsToShow)
                  }
                  className={`flex items-center text-gray-600 ${
                    currentPlaceIndex + 1 >=
                    Math.ceil(filteredPlaces.length / recordsToShow)
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-blue-500"
                  }`}
                >
                  <AiOutlineArrowRight />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No places available.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
