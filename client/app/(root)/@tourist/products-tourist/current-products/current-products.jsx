"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetch-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";

export default function CurrentProducts({ productBookings, touristId }) {
  const { currency } = useCurrencyStore();

  const [bookings, setBookings] = useState(productBookings);

  const router = useRouter();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const hasConfirmedBookingOrPending = productBookings.some(
      (booking) =>
        booking.Status === "Confirmed" || booking.Status === "Pending"
    );

    if (hasConfirmedBookingOrPending) {
      const timer = setTimeout(async () => {
        try {
          const fetchedBookingsUpdated = await fetcher(
            `/bookings/products/current?UserId=${touristId}`
          );
          setBookings(await fetchedBookingsUpdated.json());
        } catch (e) {
          console.error("Error fetching new bookings", e);
        }
      }, 60000);

      //clean up
      return () => clearTimeout(timer);
    }
  }, []);

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debounceSendFetchRequest = debounce(async (orderId) => {
    try {
      await fetcher(`/bookings/products`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          touristId: touristId,
          orderId: orderId,
        }),
      });
      const fetchedBookingsUpdated = await fetcher(
        `/bookings/products/current?UserId=${touristId}`
      );
      //console.log(`fetchedBookingsUpdated: ${fetchedBookingsUpdated}`);
      const paymentMethod = bookings.find(
        (booking) => booking._id === orderId
      ).PaymentMethod;

      // console.log("=====================");
      // console.log(paymentMethod);
      // console.log("=====================");

      setBookings(await fetchedBookingsUpdated.json());

      const touristRes = await fetcher(`/tourists/${touristId}`);

      const tourist = await touristRes.json();

      const wallet = tourist.Wallet;

      // console.log("------------------------------------------");
      // console.log(typeof wallet);
      // console.log("------------------------------------------");

      //console.log(bookings);

      if (paymentMethod !== "cash-on-delivery")
        alert(`Updated balance: ${wallet}`);
    } catch (e) {
      console.error("Failed to update bookmarks:", e);
    }
  }, 300);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">
        Your Pending Purchases and Purchases that have not yet Delivered
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Order: {formatDate(booking.createdAt)}</CardTitle>
              <div className="flex items-center">
                <span
                  className={`font-bold ${
                    booking.Status === "Confirmed"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {booking.Status}
                </span>
                <Button
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => debounceSendFetchRequest(booking._id)}
                >
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {booking.Products.map((product) => (
                <div key={product._id} className="mb-6">
                  <div className="relative mb-4 aspect-square">
                    <Image
                      src={product.ProductId.Image || "/placeholder.svg"}
                      alt={product.ProductId.Name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="mb-2 text-lg font-semibold">
                    {product.ProductId.Name}
                  </p>
                  <p className="mb-2 text-sm text-gray-500">
                    Quantity: {product.Quantity}
                  </p>
                  <p className="mb-4 text-sm text-gray-500">
                    Price:{" "}
                    {currency === "USD"
                      ? "$"
                      : currency === "EUR"
                      ? "€"
                      : "EGP"}{" "}
                    {convertPrice(
                      (product.ProductId.Price * product.Quantity).toFixed(2),
                      currency
                    )}
                  </p>
                  <Button
                    className="w-full mb-4"
                    onClick={() =>
                      router.push(`/products-tourist/${product.ProductId._id}`)
                    }
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
