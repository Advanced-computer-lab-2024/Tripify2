"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  DollarSignIcon,
  PhoneIcon,
  GlobeIcon,
  UserIcon,
  MailIcon,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useRouter } from "next/navigation";
import { convertPrice } from "@/lib/utils";
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";

export default function ActivityDetails({ activity }) {
  const [numParticipants, setNumParticipants] = useState(1);
  const [error, setError] = useState("");
  const router = useRouter();

  const session = useSession();

  const { currency } = useCurrencyStore();

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const {
    Name = "Activity Name Not Available",
    Date: theDate,
    Time: theTime,
    Location = "Location Not Available",
    Price = 0,
    Duration = "Duration Not Available",
    Image = "",
    SpecialDiscounts = 0,
    Tags = [],
    CategoryId = [],
    AdvertiserId = {},
  } = activity;

  // Format Date and Time
  const formattedDate =
    new Date(theDate).toLocaleDateString() || "Date Not Available";
  const formattedTime =
    new Date(theTime).toLocaleTimeString() || "Time Not Available";

  const generateLink = (latitude, longitude) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Please enter valid coordinates.");
      setLink("");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Coordinates are out of range.");
      setLink("");
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    return url;
  };

  const handleBook = async () => {
    try {
      const response = await fetcher(
        `/bookings/activities/create-booking/${activity._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currency,
            Participants: numParticipants,
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

  const handleShareEmail = () => {
    const subject = encodeURIComponent(
      `Check out this activity: ${activity.Name}`
    );
    const body = encodeURIComponent(
      `I found this amazing activity and thought you might be interested:\n\n${activity.Name}\n\nCheck it out here: ${window.location.href}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = () => {
    const dummyLink = session?.data?.user
      ? `http://localhost:3000/activities/${activity._id}`
      : `http://localhost:3000/activities-guest/${activity._id}`;
    navigator.clipboard.writeText(dummyLink);
  };

  return (
    <div className="container p-6 mx-auto">
      <div className="relative h-96">
        <img src={Image} alt={Name} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="mb-2 text-4xl font-bold text-white">{Name}</h1>
        </div>
      </div>

      <div className="p-6">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-green-500" />
                  <span>{formattedTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2 text-red-500" />
                  <Link
                    target="_blank"
                    href={generateLink(
                      Location.coordinates[0],
                      Location.coordinates[1]
                    )}
                  >
                    {generateLink(
                      Location.coordinates[0],
                      Location.coordinates[1]
                    )}
                  </Link>
                </div>
                <div className="flex items-center">
                  <DollarSignIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  <span className="mr-1 text-sm font-light line-through">
                    {currency === "USD"
                      ? "$"
                      : currency === "EUR"
                        ? "€"
                        : "EGP"}{" "}
                    {convertPrice(Price, currency)}
                  </span>
                  <span className="font-bold">
                    {currency === "USD"
                      ? "$"
                      : currency === "EUR"
                        ? "€"
                        : "EGP"}{" "}
                    {convertPrice(
                      Price * ((100 - SpecialDiscounts) / 100),
                      currency
                    )}
                  </span>
                  {SpecialDiscounts > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {SpecialDiscounts}% off
                    </Badge>
                  )}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-purple-500" />
                  <span>{Duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories and Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(CategoryId) && CategoryId.length > 0 ? (
                      CategoryId.map((category) => (
                        <Badge key={category._id} variant="outline">
                          {category.Category || "Category Not Available"}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">
                        No Categories Available
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Tags.length > 0 ? (
                      Tags.map((tag) => (
                        <Badge key={tag._id} variant="secondary">
                          {tag.Tag || "Tag Not Available"}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No Tags Available</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Advertiser Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
                <span>
                  Name: {AdvertiserId.UserId.UserName || "Not Available"}
                </span>
              </div>
              <div className="flex items-center">
                <GlobeIcon className="w-5 h-5 mr-2 text-green-500" />
                <span>
                  Website:{" "}
                  {AdvertiserId.CompanyProfile.Website || "Not Available"}
                </span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-2 text-red-500" />
                <span>
                  Hotline:{" "}
                  {AdvertiserId.CompanyProfile.Hotline || "Not Available"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="p-6 mt-6 mb-8 bg-gray-100 rounded-lg">
          <h2 className="mb-4 text-2xl font-semibold">Book Now</h2>
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
                    disabled={activity.RemainingBookings < num}
                    key={num}
                    value={num}
                  >
                    {num} {num === 1 ? "Participant" : "Participants"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-gray-700">Total Price</p>
            <p className="text-3xl font-bold text-blue-600">
              {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
              {convertPrice(
                activity.Price *
                numParticipants *
                ((100 - SpecialDiscounts) / 100),
                currency
              )}
            </p>
          </div>
          <button
            onClick={handleBook}
            disabled={activity.RemainingBookings === 0 || !session?.data?.user}
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-blue-500 rounded-lg disabled:opacity-65 disabled:hover:scale-100 disabled:hover:bg-gray-500 disabled:bg-gray-500 hover:bg-blue-600 hover:scale-105"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
