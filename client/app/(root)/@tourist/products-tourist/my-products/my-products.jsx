"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Callout } from "@/components/ui/Callout";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";

export default function UserPurchases({ user, productBookings }) {
  const router = useRouter();

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);

    const res = await fetcher(
      `/reviews/products/${selectedProduct.ProductId._id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Rating: reviewRating, Review: reviewText }),
      }
    );

    if (!res.ok) {
      setLoading(false);
      setError("Failed to submit review");
      return;
    }

    setLoading(false);
    router.refresh();

    setIsReviewDialogOpen(false);
    setReviewRating(5);
    setReviewText("");
    setSelectedProduct(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hasUserReviewed = (product) => {
    return product.Reviews.some((review) => review.UserId?._id === user.userId);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Your Purchases</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {productBookings.map((booking) => (
          <Card key={booking._id}>
            <CardHeader>
              <CardTitle>Order: {formatDate(booking.createdAt)}</CardTitle>
              <span
                className={`font-bold ${
                  booking.Status === "Confirmed"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {booking.Status}
              </span>
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
                    Price: $
                    {(product.ProductId.Price * product.Quantity).toFixed(2)}
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
                  {hasUserReviewed(product.ProductId) ? (
                    <div>
                      <p className="mb-2 font-semibold">
                        You have reviewed this product
                      </p>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < product.ProductId.Rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsReviewDialogOpen(true);
                      }}
                      className="w-full"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Leave a Review
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Leave a Review for {selectedProduct?.ProductId.Name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <RadioGroup
                id="rating"
                value={reviewRating.toString()}
                onValueChange={(value) => setReviewRating(parseInt(value))}
                className="flex space-x-2"
                disabled={loading}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <RadioGroupItem
                      value={rating.toString()}
                      id={`rating-${rating}`}
                    />
                    <Label htmlFor={`rating-${rating}`} className="ml-2">
                      {rating}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="Write your review here..."
                required
                disabled={loading}
              />
            </div>
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
            {error && (
              <Callout
                variant="error"
                title="Something went wrong"
                className="mt-2"
              >
                {error}
              </Callout>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
