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
import { ArrowRight, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Explore({ params }) {
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

  return (
    <div className="mx-20 mt-5 sm:mx-22 md:mx-24 lg:mx-26 xl:mx-30">
      <div className="w-full mb-6 text-white bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex flex-col items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:flex-row">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Plane className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Design Your Dream Getaway</h2>
              <p className="text-blue-100">Create a personalized vacation package tailored just for you</p>
            </div>
          </div>
          <Link href='/create-vacation'>
            <Button 
              className="flex items-center gap-2 px-6 py-2 font-semibold text-blue-600 transition-colors bg-white rounded-full hover:bg-blue-50"
            >
              Start Planning
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative">
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

      <section className="my-8">
        <h2 className="flex items-center justify-between mb-6 text-2xl font-semibold">
          <span>Itineraries ({filteredItineraries.length})</span>
          <button
            onClick={() => router.push("/itineraries")}
            className="px-2 py-1 text-sm text-white transition duration-200 bg-gray-400 rounded hover:bg-gray-500"
          >
            View All
          </button>
        </h2>
        {filteredItineraries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {getDisplayedItineraries().map((itinerary) => (
                <button
                  key={itinerary._id}
                  className="text-left transition-shadow duration-200 rounded-lg hover:shadow-lg"
                  onClick={() => router.push(`/itineraries/${itinerary._id}`)}
                >
                  <img
                    src={itinerary.Image}
                    alt={itinerary.Name}
                    className="object-cover w-full h-32 mb-2 rounded-md"
                  />
                  <h3 className="text-lg font-medium">{itinerary.Name}</h3>
                </button>
              ))}
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
      </section>

      <hr />

      <section className="my-8">
        <h2 className="flex items-center justify-between mb-6 text-2xl font-semibold">
          <span>Activities ({filteredActivities.length})</span>
          <button
            onClick={() => router.push("/activities")}
            className="px-2 py-1 text-sm text-white transition duration-200 bg-gray-400 rounded hover:bg-gray-500"
          >
            View All
          </button>
        </h2>
        {filteredActivities.length > 0 ? (
          <>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {getDisplayedActivities().map((activity) => (
                <button
                  key={activity._id}
                  className="w-full text-left transition-shadow duration-200 rounded-lg hover:shadow-lg"
                  onClick={() => router.push(`/activities/${activity._id}`)}
                >
                  <img
                    src={activity.Image}
                    alt={activity.Name}
                    className="object-cover w-full h-32 mb-2 rounded-md"
                  />
                  <p className="text-lg font-medium">{activity.Name}</p>
                  <p className="text-gray-500">From: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'} {convertPrice(activity.Price, currency)}</p>
                </button>
              ))}
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
      </section>

      <hr />

      <section className="my-8">
        <h2 className="flex items-center justify-between mb-6 text-2xl font-semibold">
          <span>Places ({filteredPlaces.length})</span>
          <button
            onClick={() => router.push("/places")}
            className="px-2 py-1 text-sm text-white transition duration-200 bg-gray-400 rounded hover:bg-gray-500"
          >
            View All
          </button>
        </h2>
        {filteredPlaces.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {getDisplayedPlaces().map((place) => (
                <button
                  key={place._id}
                  className="text-left transition-shadow duration-200 rounded-lg hover:shadow-lg"
                  onClick={() => router.push(`/places/${place._id}`)}
                >
                  <img
                    src={place.Pictures[0]}
                    alt={place.Name}
                    className="object-cover w-full h-32 mb-2 rounded-md"
                  />
                  <h3 className="text-lg font-medium">{place.Name}</h3>
                </button>
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
      </section>
    </div>
  );
}
