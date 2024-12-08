"use client";
import React, { useEffect, useState } from "react";
import CartItem from "./cartItem";
import { useRouter } from "next/navigation";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

function cartPage({ Cart, touristId }) {
  const { currency } = useCurrencyStore();

  const [cart, setCart] = useState(Cart);

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  //console.log(cart);
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum += cart[i].product.Price * cart[i].quantity;
  }
  //console.log(sum);

  useEffect(() => {
    setCart(cart);
  }, [cart]);

  const items = cart.map((item) => (
    <CartItem
      key={item.product._id}
      product={item.product}
      quantity={item.quantity}
      cart={cart}
      setCart={setCart}
      touristId={touristId}
    />
  ));

  return (
    <div className="p-6 px-14">
      <h1 className="text-2xl font-bold">My Cart</h1>
      {items.length ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 text-left">Product</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{items}</TableBody>
          </Table>
          <div className="total-price text-right mb-6">
            <h2 className="font-semibold text-xl text-gray-800 mb-2">
              Total Price
            </h2>
            <div className="flex justify-end items-center space-x-1">
              <span className="text-2xl font-bold text-gray-900">
                {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
                {convertPrice(sum.toFixed(2), currency)}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              router.push("/checkout");
            }}
            disabled={loading}
            className={
              "w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-medium transition hover:bg-blue-600 mt-8"
            }
          >
            {loading ? (
              <Loader2 size={16} className="text-white animate-spin mx-auto" />
            ) : (
              "Checkout"
            )}
          </button>
        </>
      ) : (
        <p className="text-gray-600 text-center">Cart is empty</p>
      )}
    </div>
  );
}

export default cartPage;
