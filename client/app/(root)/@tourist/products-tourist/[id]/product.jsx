"use client";

import { useState , useEffect } from 'react'
import Image from 'next/image'
import { Star, ShoppingBag, User, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { fetcher } from '@/lib/fetch-client'
import { useCurrencyStore } from '@/providers/CurrencyProvider'
import { convertPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'
export default function ProductPage({ product, cart }) {
  const { currency } = useCurrencyStore()

  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [WishList2, setWishList] = useState([]);
  const { data: session, status } = useSession();
  const [getWishList, setGetWishList] = useState(true);
  const [Cart, setCart] = useState(cart);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.AvailableQuantity) {
      setQuantity(value);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && getWishList) {
      console.log("GOT");
      fetchTourist(session?.user?.id);
      setGetWishList(false);
    }
  }, [status, session?.user?.id]);

  useEffect(() => {
    if (status === "authenticated" && !getWishList) {
      console.log("Update");
      UpdateWishList2(session?.user?.id);
    }
  }, [WishList2]);

  const fetchTourist = async (userId) => {
    try {
      const res = await fetcher(`/tourists/${userId}`).catch((e) =>
        console.error("Error fetching tourist:", e)
      );

      if (!res.ok) {
        const resError = await res.json();
        console.log(resError);
        return <>error</>;
      }

      const Tourist = await res.json();
      setWishList(Tourist.Wishlist);
    } catch (e) {
      console.error("Error fetching tourist:", e);
    }
  };

  const UpdateWishList2 = async (userId) => {
    try {
      const res = await fetcher(`/tourists/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Wishlist: WishList2 }),
      });

      if (!res.ok) {
        const resError = await res.json();
        console.log(resError);
        return <>error</>;
      }

      console.log({ "SINGLE PRODUCT": await res.json() });
    } catch (e) {
      console.error("Error fetching tourist:", e);
    }
  };

  const toggleWishlist = (productId) => {
    setWishList((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const addToCart = async () => {
      let newcart = [].concat(Cart);
      let flag = false;
      console.log(newcart)
      console.log(newcart.length)
      for (let i = 0; i<newcart.length; i++){
        if (product._id == newcart[i].product){
          flag = true;
          newcart[i].quantity += quantity;
        }
      }
      if (!flag){
        newcart.push({product: product._id, quantity: quantity})
      }
      try{const touristRes = await fetcher(`/tourists/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Cart: newcart }),
      });

      if (!touristRes.ok) {
        const errorData = await touristRes.json();
        throw new Error(errorData.message || "Failed to update cart");
      }

      const data = await touristRes.json();
      } catch (error) {
        console.error("Error updating cart:", error);
      }
      alert(`${quantity} ${product.Name} added`)
      setCart(newcart)
  }

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
            <Button className="ml-4" onClick={addToCart}>
              Add To Cart
            </Button>
          </div>
          <div className="flex items-center mb-6 space-x-4">
            <Button
              variant={WishList2.includes(product._id) ? "solid" : "outline"}
              className={`transition-all duration-200 ease-in-out ${
                WishList2.includes(product._id)
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => toggleWishlist(product._id)}
            >
              {WishList2.includes(product._id)
                ? "♥ Added to Wishlist"
                : "♡ Add to Wishlist"}
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
