"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShoppingBag, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { convertPrice } from "@/lib/utils";

export default function ProductPage({ product }) {
  const { currency } = useCurrencyStore();

  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.AvailableQuantity) {
      setQuantity(value);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    // Implement purchase functionality here
    try {
      const response = await fetcher(
        `/bookings/products/create-booking/${product._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currency,
            Quantity: quantity,
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
    setIsDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Image
            src={product.Image || "/placeholder.svg"}
            alt={product.Name}
            width={500}
            height={500}
            className="object-cover w-full h-auto rounded-lg"
          />
        </div>
        <div>
          <h1 className="mb-4 text-3xl font-bold">{product.Name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.Rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.Reviews.length} reviews)
            </span>
          </div>
          <p className="mb-4 text-2xl font-bold">
            {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}
            {convertPrice(product.Price, currency)}
          </p>
          <p className="mb-6 text-gray-600">{product.Description}</p>
          <div className="flex items-center mb-6">
            <Input
              type="number"
              min="1"
              max={product.AvailableQuantity}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 mr-4"
            />
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="flex items-center transition-all duration-200 ease-in-out"
            >
              {loading && <Loader2 size={16} className="animate-spin mr-0.5" />}
              <ShoppingBag className="mr-2" />
              Buy Now
            </Button>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            {product.AvailableQuantity} items available | {product.TotalSales}{" "}
            sold
          </p>
          <p className="text-sm text-gray-500">
            Sold by: {product?.Seller?.UserName} ({product?.Seller?.Role})
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Customer Reviews</h2>
        {product.Reviews.length > 0 ? (
          <div className="grid gap-6">
            {product.Reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <Avatar className="w-10 h-10 mr-4">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.UserId.UserName}`}
                      />
                      <AvatarFallback>
                        {review.UserId.UserName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">
                            {review.UserId.UserName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {review.UserId.Role}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.Rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.Review}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Successful</DialogTitle>
          </DialogHeader>
          <p>
            Thank you for your purchase of {quantity} {product.Name}(s).
          </p>
          <p>Total: ${(quantity * product.Price).toFixed(2)}</p>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
