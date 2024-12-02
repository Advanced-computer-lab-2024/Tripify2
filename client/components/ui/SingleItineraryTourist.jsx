"use client";

import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { Button } from "./ButtonInput";
import { fetcher } from "@/lib/fetch-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  TagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckIcon,
  StarIcon,
  ShieldCheckIcon,
  MailIcon,
  LinkIcon,
} from "lucide-react";
import { Badge } from "./badge";
import { useSession } from "next-auth/react";
import { RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";
import { Input } from "./InputForm";
import { Loader2 } from "lucide-react";

export default function ItineraryDetails({ itinerary, bookmarked }) {
  const router = useRouter();
  const session = useSession();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [validatingPromo, setValidatingPromo] = useState(false);

  const { currency } = useCurrencyStore();

  const [numParticipants, setNumParticipants] = useState(1);

  const [bookmarkedItineraries, setBookmarkedItineraries] =
    useState(bookmarked);

  const isBookmarked = bookmarkedItineraries.includes(itinerary._id);

  if (!itinerary) return <p>Loading...</p>;

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setValidatingPromo(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      const response = await fetcher('/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          amount: itinerary.Price * numParticipants
        })
      });

      if (!response.ok) {
        const error = await response.json();
        setPromoError(error.message);
        setDiscountedPrice(null);
        return;
      }

      const data = await response.json();
      setDiscountedPrice(data.discount);
      setPromoSuccess(data.type === 'percentage'
        ? `${data.value}% discount applied!`
        : `${currency} ${convertPrice(data.value, currency)} discount applied!`);
    } catch (error) {
      setPromoError('Error validating promo code');
      setDiscountedPrice(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(
      `Check out this itinerary: ${itinerary.Name}`
    );
    const body = encodeURIComponent(
      `I found this amazing itinerary and thought you might be interested:\n\n${itinerary.Name}\n\nCheck it out here: ${window.location.href}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = () => {
    const dummyLink = session?.data?.user
      ? `http://localhost:3000/itineraries/${itinerary._id}`
      : `http://localhost:3000/itineraries-guest/${itinerary._id}`;
    navigator.clipboard.writeText(dummyLink);
  };

  const handleBook = async () => {
    try {
      const response = await fetcher(
        `/bookings/itineraries/create-booking/${itinerary._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currency,
            Participants: numParticipants,
            promoCode: promoCode || undefined
          }),
        }
      );

      if (!response?.ok) {
        const data = await response.json();
        console.log(data.msg);
        return;
      }

      const data = await response.json();

      if (!data) {
        console.log("Error creating booking");
        return;
      }

      router.push(data.url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = (id) => {
    let updatedBookmarks;
    setBookmarkedItineraries((prev) => {
      updatedBookmarks = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
      debounceSendPatchRequest(updatedBookmarks);
      return updatedBookmarks;
    });
  };

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debounceSendPatchRequest = debounce(async (updatedBookmarks) => {
    try {
      await fetcher(`/tourists/${session?.data?.user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ BookmarkedItinerary: updatedBookmarks }),
      });
    } catch (e) {
      console.error("Error occurred while updating bookmarks", e);
    }
  }, 300);

  return (
    <div className="container p-6 mx-auto">
      <div className="relative h-96">
        <img
          src={itinerary.Image}
          alt={itinerary.Name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="mb-2 text-4xl font-bold text-white">
            {itinerary.Name}
          </h1>
          {itinerary.Tag.map((tag, index) => (
            <Badge
              key={index}
              variant="neutral"
              className="text-black bg-white"
            >
              {tag.Tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div
          className="flex justify-start mb-4 space-x-4"
          onClick={() => handleBookmark(itinerary._id)}
        >
          {isBookmarked ? (
            <RiBookmarkFill className="text-yellow-500" />
          ) : (
            <RiBookmarkLine className="text-gray-500" />
          )}
        </div>
        <div className="flex justify-end mb-4 space-x-4">
          <button
            onClick={handleShareEmail}
            className="flex items-center px-4 py-2 text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            <MailIcon className="w-5 h-5 mr-2" />
            Share via Email
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center px-4 py-2 text-gray-800 transition duration-300 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            <LinkIcon className="w-5 h-5 mr-2" />
            Copy Link
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="flex items-center space-x-3">
            <MapPinIcon className="w-6 h-6 text-blue-500" />
            <span className="text-gray-700">New York City</span>
          </div>
          <div className="flex items-center space-x-3">
            <UserIcon className="w-6 h-6 text-green-500" />
            <span className="text-gray-700">
              Tour Guide: {itinerary.TourGuide.YearsOfExperience} years exp.
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <ClockIcon className="w-6 h-6 text-yellow-500" />
            <span className="text-gray-700">
              Duration:{" "}
              {itinerary.Activities.reduce((acc, act) => acc + act.duration, 0)}{" "}
              minutes
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckIcon className="w-6 h-6 text-purple-500" />
            <span className="text-gray-700">
              Accessibility: {itinerary.Accesibility ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <StarIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-gray-700">Rating: {itinerary.Rating}/5</span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="w-6 h-6 text-green-500" />
            <span className="text-gray-700">
              {itinerary.RemainingBookings} spots left
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Itinerary Activities</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {itinerary.Activities.map((activity, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="mb-2 text-lg font-semibold">{activity.type}</h3>
                <p className="text-gray-600">{activity.duration} minutes</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Itinerary Categories</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {itinerary.Category.map((category, index) => (
              <Badge key={index} className="py-2 w-fit">
                {category.Category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-6 mb-8 bg-gray-100 rounded-lg">
          <h2 className="mb-4 text-2xl font-semibold">Book Your Tour</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="participants"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Number of Participants
              </label>
              <select
                id="participants"
                value={numParticipants}
                onChange={(e) => setNumParticipants(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option
                    disabled={itinerary.RemainingBookings < num}
                    key={num}
                    value={num}
                  >
                    {num} {num === 1 ? "Participant" : "Participants"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="promoCode"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Promo Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="promoCode"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="uppercase"
                />
                <button
                  onClick={validatePromoCode}
                  disabled={validatingPromo}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {validatingPromo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              {promoError && (
                <p className="mt-1 text-sm text-red-500">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="mt-1 text-sm text-green-500">{promoSuccess}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-gray-700">Total Price</p>
            <p className="text-3xl font-bold text-blue-600">
              {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
              {convertPrice(itinerary.Price * numParticipants, currency)}
            </p>
          </div>
          <button
            onClick={handleBook}
            disabled={
              itinerary.RemainingBookings === 0 || !itinerary.Accesibility
            }
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-blue-500 rounded-lg disabled:opacity-65 disabled:hover:scale-100 disabled:hover:bg-gray-500 disabled:bg-gray-500 hover:bg-blue-600 hover:scale-105"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
