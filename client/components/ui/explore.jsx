"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiOutlineSearch,
} from "react-icons/ai";

export default function Explore({ params }) {
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
    <div className="mx-20 sm:mx-22 md:mx-24 lg:mx-26 xl:mx-30 mt-5">
      <div className="relative">
        <span
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          style={{ fontSize: "25px" }}
        >
          <AiOutlineSearch />
        </span>
        <input
          type="text"
          placeholder="Where are you going?"
          className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:bg-white transition duration-200"
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
        <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
          <span>Itineraries ({filteredItineraries.length})</span>
          <button
            onClick={() => router.push("/itineraries")}
            className="text-sm bg-gray-400 text-white rounded px-2 py-1 hover:bg-gray-500 transition duration-200"
          >
            View All
          </button>
        </h2>
        {filteredItineraries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {getDisplayedItineraries().map((itinerary) => (
                <button
                  key={itinerary._id}
                  className="rounded-lg hover:shadow-lg transition-shadow duration-200 text-left"
                  onClick={() => router.push(`/itineraries/${itinerary._id}`)}
                >
                  <img
                    src={itinerary.Image}
                    alt={itinerary.Name}
                    className="w-full h-32 object-cover rounded-md mb-2"
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
        <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
          <span>Activities ({filteredActivities.length})</span>
          <button
            onClick={() => router.push("/activities")}
            className="text-sm bg-gray-400 text-white rounded px-2 py-1 hover:bg-gray-500 transition duration-200"
          >
            View All
          </button>
        </h2>
        {filteredActivities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
              {getDisplayedActivities().map((activity) => (
                <button
                  key={activity._id}
                  className="rounded-lg hover:shadow-lg transition-shadow duration-200 text-left w-full"
                  onClick={() => router.push(`/activities/${activity._id}`)}
                >
                  <img
                    src={activity.Image}
                    alt={activity.Name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-lg font-medium">{activity.Name}</p>
                  <p className="text-gray-500">From: ${activity.Price}</p>
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
        <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
          <span>Places ({filteredPlaces.length})</span>
          <button
            onClick={() => router.push("/places")}
            className="text-sm bg-gray-400 text-white rounded px-2 py-1 hover:bg-gray-500 transition duration-200"
          >
            View All
          </button>
        </h2>
        {filteredPlaces.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {getDisplayedPlaces().map((place) => (
                <button
                  key={place._id}
                  className="rounded-lg hover:shadow-lg transition-shadow duration-200 text-left"
                  onClick={() => router.push(`/places/${place._id}`)}
                >
                  <img
                    src={place.Pictures[0]}
                    alt={place.Name}
                    className="w-full h-32 object-cover rounded-md mb-2"
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
