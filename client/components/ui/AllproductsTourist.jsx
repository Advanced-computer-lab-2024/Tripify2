"use client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";

import { Heart, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AllproductsTourist({
  products,
  searchQuery,
  currentMaxPrice,
  wishlist,
  cart,
}) {
  // const session = useSession();
  // const id = session?.data?.user?.id;
  const { currency } = useCurrencyStore();
  const [WishList, setWishlist] = useState(wishlist);
  const [Cart, setCart] = useState(cart);
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session status and data

  // console.log(products);
  useEffect(() => {
    setWishlist(wishlist);
  }, [wishlist]);

  useEffect(() => {
    setCart(cart);
  }, [cart]);

  // useEffect(() => {
  //   if (status === "authenticated"){
  //     UpdateWishList(session?.user?.id);
  //     // console.log({"HELP" : WishList});
  //   }
  // }, [WishList]);

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const UpdateWishList = debounce(async (userId, UpdatedWishList) => {
    try {
      const res = await fetcher(`/tourists/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Wishlist: UpdatedWishList }),
      });

      if (!res.ok) {
        const resError = await res.json();
        console.log(resError);
        return <>error</>;
      }

      console.log({ "All Products": await res.json() });
    } catch (e) {
      console.error("Error fetching tourist's wishlist:", e);
    }
  }, 300);

  // console.log("Max Price: ", currentMaxPrice)
  products.forEach((product) =>
    console.log(
      "Price: ",
      Number(convertPrice(product.Price, currency)) <= currentMaxPrice
    )
  );
  const filteredProductsBefore = products?.filter(
    (product) =>
      product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.Price.toString().includes(searchQuery)
  );

  const filteredProducts = filteredProductsBefore.filter(
    (product) => !product?.Archived
  );
  //console.log(`filteredProducts[0]: ${JSON.stringify(filteredProducts[0])}`);

  if (!filteredProducts || filteredProducts.length === 0) {
    return <h2>No products found.</h2>;
  }

  const handleViewDetails = (id) => {
    router.push(`/products-tourist/${id}`);
  };

  const toggleWishlist = (productId) => {
    let x;
    setWishlist((prevWishlist) => {
      prevWishlist.includes(productId)
        ? (x = prevWishlist.filter((id) => id !== productId))
        : (x = [...prevWishlist, productId]);
      UpdateWishList(session.user.id, x);
      return x;
    });
  };

  const addToCart = async (productId, availablequantity) => {
    let newcart = [].concat(Cart);
    let flag = false;
    //console.log("before");
    //console.log(newcart);
    let currentquantity = 1;
    for (let i = 0; i < newcart.length; i++) {
      if (productId == newcart[i].product) {
        flag = true;
        newcart[i].quantity += 1;
        currentquantity = newcart[i].quantity;
      }
    }
    if (flag == false) {
      newcart.push({ product: productId, quantity: 1 });
    }
    //console.log("after");
    //console.log(newcart);
    if (availablequantity >= currentquantity) {
      try {
        const touristRes = await fetcher(`/tourists/${session.user.id}`, {
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
      alert("added to cart");
      //console.log("add");
      //console.log(newcart);
      setCart(newcart);
    } else {
      alert("item out of stock");
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
      {filteredProducts.map((eachproduct) => (
        <Card
          key={eachproduct._id}
          className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100 flex flex-col"
          onClick={() => handleViewDetails(eachproduct._id)}
        >
          <CardHeader className="flex-grow justify-between relative">
            {!eachproduct?.AvailableQuantity && (
              <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                Out of Stock
              </Badge>
            )}
            <img
              src={eachproduct.Image}
              alt={eachproduct.Name}
              className="object-cover w-full h-48 mb-2 rounded-lg"
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg font-bold">
              {eachproduct.Name}
            </CardTitle>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="mr-1">{eachproduct.Rating}</span>
              </div>
              <div
                className="text-2xl cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); //prevent parent click
                  toggleWishlist(eachproduct._id);
                }}
              >
                <Heart
                  size={23}
                  className={
                    WishList.includes(eachproduct._id)
                      ? "text-red-500"
                      : "text-gray-600"
                  }
                  fill={
                    WishList.includes(eachproduct._id) ? "currentColor" : "none"
                  }
                />
              </div>
            </div>
            <CardDescription className="text-sm text-black-600">
              Price:{" "}
              {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}
              {convertPrice(eachproduct.Price, currency)}
            </CardDescription>
          </CardContent>
          <div className="p-4 flex flex-col space-y-3 mt-auto item-center">
            <button
              className={`px-4 py-2 rounded-md transition flex items-center justify-center ${
                eachproduct.AvailableQuantity === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              disabled={!eachproduct?.AvailableQuantity}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(eachproduct._id, eachproduct.AvailableQuantity);
              }}
            >
              <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
