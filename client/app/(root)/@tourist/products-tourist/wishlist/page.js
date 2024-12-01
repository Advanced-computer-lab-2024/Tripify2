"use client";
import { useEffect, useState } from "react";
import AllproductsTourist from "@/components/ui/AllproductsTourist";
import { fetcher } from "@/lib/fetch-client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Heart, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function wishlistProducts() {
  const { currency } = useCurrencyStore();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [WishList1, setWishList] = useState([]);
  const { data: session, status } = useSession(); // Get session status and data
  const [Cart, setCart] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetcher("/products", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.json();

      const stringifiedData = JSON.stringify(data);

      // console.log("Stringified Data: ", stringifiedData);

      setProducts(data.filter((product) => !product.Archived));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

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
      setCart(Tourist.Cart);
      setWishList(Tourist.Wishlist);
      console.log("WENT BACK", Tourist.Wishlist);
    } catch (e) {
      console.error("Error fetching tourist:", e);
    }
  };

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

  useEffect(() => {
    if (status === "authenticated") fetchTourist(session?.user?.id);
  }, [status, session?.user?.id]);

  useEffect(() => {
    fetchProducts();

    const intervalId = setInterval(() => {
      fetchProducts();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleViewDetails = (id) => {
    router.push(`/products-tourist/${id}`);
  };

  const toggleWishlist = (productId) => {
    let x;
    setWishList((prevWishlist) => {
      prevWishlist.includes(productId)
        ? (x = prevWishlist.filter((id) => id !== productId))
        : (x = [...prevWishlist, productId]);
      UpdateWishList(session.user.id, x);
      return x;
    });
  };

  const wishlistProducts = products.filter((product) =>
    WishList1.includes(product._id)
  );

  const addToCart = async (productId, availablequantity) => {
    let newcart = [].concat(Cart);
    let flag = false;
    let currentquantity = 1;
    for (let i = 0; i < newcart.length; i++) {
      if (productId == newcart[i].product) {
        flag = true;
        newcart[i].quantity += 1;
        currentquantity = newcart[i].quantity;
      }
    }
    if (!flag) {
      newcart.push({ product: productId, quantity: 1 });
    }
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
      setCart(newcart);
    } else {
      alert("item out of stock");
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-6 p-10">
      {wishlistProducts.map((eachproduct) => (
        <Card
          key={eachproduct._id}
          className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100 flex flex-col"
          onClick={() => handleViewDetails(eachproduct._id)}
        >
          <CardHeader className="flex-grow justify-between relative">
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
                    WishList1.includes(eachproduct._id)
                      ? "text-red-500"
                      : "text-gray-600"
                  }
                  fill={
                    WishList1.includes(eachproduct._id)
                      ? "currentColor"
                      : "none"
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
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center justify-center"
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
