"use client"; // Marking this component as a Client Component

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetch-client";
import Image from "next/image";
import { Star, ShoppingBag, Loader2, Heart } from "lucide-react";
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
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { convertPrice } from "@/lib/utils";

export default function ProductDetail({ params }) {
  const { currency } = useCurrencyStore();

  const { id } = params; // Access the dynamic product ID from the URL parameters
  const [product, setProduct] = useState(null);
  const [sellerName, setSellerName] = useState(null); // State for storing seller name

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch the product details
        const response = await fetcher(`/products/${id}`);
        let data = await response.json();

        // Stringify the product data
        const stringifiedProductData = JSON.stringify(data);
        //console.log("Stringified Product Data: ", stringifiedProductData); // For debugging

        setProduct(data);

        // Fetch the seller's name using the UserId from the seller object
        if (data.Seller) {
          const sellerId = data.Seller._id; // Assuming data.Seller is an object with _id
          const sellerResponse = await fetcher(`/users/${sellerId}`); // Adjusted to use the userId route
          const sellerData = await sellerResponse.json();

          // Stringify the seller data
          const stringifiedSellerData = JSON.stringify(sellerData);
          //console.log("Stringified Seller Data: ", stringifiedSellerData); // For debugging

          // Check if the seller data has the UserName and then extract it
          if (sellerData.UserName) {
            setSellerName(sellerData.UserName); // Assuming the seller object has UserName directly
          }
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Couldn't Fetch Details</div>;
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
          <p className="mb-4 text-sm text-gray-500">
            {product.AvailableQuantity} items available | {product.TotalSales}{" "}
            sold
          </p>
          <p className="text-sm text-gray-500">
            Sold by: {product?.Seller?.UserName} ({product?.Seller?.Role})
          </p>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div style={styles.container}>
  //     <h1>{product.Name}</h1>
  //     {product.Image && (
  //       <img src={product.Image} alt={product.Name} style={styles.image} />
  //     )}
  //     <p>Price: ${product.Price}</p>
  //     <p>Description: {product.Description}</p>
  //     <p>Seller Name: {sellerName ? sellerName : "Loading seller..."}</p>{" "}
  //     {/* Display seller name */}
  //     <p>Rating: {product.Rating}</p>
  //     <p>Available Quantity: {product.AvailableQuantity}</p>
  //   </div>
  // );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  image: {
    width: "100%", // Adjust as needed
    height: "auto",
    borderRadius: "8px",
    marginBottom: "15px",
  },
};
