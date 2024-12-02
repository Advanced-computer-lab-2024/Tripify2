"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetcher } from "@/lib/fetch-client";
import { getSession } from "@/lib/session";
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

const CartItem = ({ product, quantity, cart, touristId, setCart }) => {
  const { currency } = useCurrencyStore();
  const [quantitynew, setquantity] = useState(quantity);
  const session = useRef(null);

  useEffect(() => {
    setquantity(quantity);
    setCart(cart);
    const fetchSession = async () => {
      session.current = await getSession();
    };
    fetchSession();
  }, [quantity]);

  const addItem = async () => {
    console.log(product.AvailableQuantity);
    console.log(quantitynew + 1);
    if (product.AvailableQuantity >= quantitynew + 1) {
      const newCart = cart.map((item) =>
        item.product._id == product._id
          ? { product: item.product._id, quantity: quantitynew + 1 }
          : { product: item.product._id, quantity: item.quantity }
      );

      try {
        const touristRes = await fetcher(`/tourists/${touristId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Cart: newCart }),
        });

        if (!touristRes.ok) {
          const errorData = await touristRes.json();
          throw new Error(errorData.message || "Failed to update cart");
        }

        const data = await touristRes.json();
      } catch (error) {
        console.error("Error updating cart:", error);
      }
      setCart((old) =>
        cart.map((item) =>
          item.product._id == product._id
            ? { ...item, quantity: quantitynew + 1 }
            : item
        )
      );
    } else {
      alert("cannot add more items (out of stock)");
    }
  };

  const subItem = async () => {
    const touristId = session.current?.user?.id;

    if (quantitynew - 1 == 0) {
      let newCart = [];
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product._id !== product._id) {
          newCart.push({
            product: cart[i].product._id,
            quantity: cart[i].quantity,
          });
        }
      }
      const touristRes = await fetcher(`/tourists/${touristId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Cart: newCart }),
      });

      if (!touristRes.ok) throw new Error("Network response was not ok");

      let finalcart = [];
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product._id !== product._id) {
          finalcart.push(cart[i]);
        }
      }
      setCart(finalcart);
    } else {
      const newCart = cart.map((item) =>
        item.product._id == product._id
          ? { ...item, quantity: Math.max(quantitynew - 1, 0) }
          : item
      );
      const touristRes = await fetcher(`/tourists/${touristId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Cart: newCart }),
      });

      if (!touristRes.ok) throw new Error("Network response was not ok");
      setCart(
        cart.map((item) =>
          item.product._id == product._id
            ? { ...item, quantity: quantitynew - 1 }
            : item
        )
      );
    }
  };

  const deleteItem = async () => {
    const touristId = session.current?.user?.id;
    let newCart = [];
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].product._id !== product._id) {
        newCart.push(cart[i]);
      }
    }
    const touristRes = await fetcher(`/tourists/${touristId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Cart: newCart }),
    });

    if (!touristRes.ok) throw new Error("Network response was not ok");
    setCart(newCart);
  };

  return (
    <TableRow className="hover:bg-gray-100">
      <TableCell className="flex items-center space-x-4">
        <img
          src={product?.Image}
          alt={product?.Name}
          className="w-16 h-16 object-cover rounded-md"
        />
        <span className="font-semibold text-gray-700">{product?.Name}</span>
      </TableCell>
      <TableCell className="text-center">
        <span className="font-semibold text-gray-700">
          {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
          {convertPrice((product?.Price).toFixed(2), currency)}
        </span>
      </TableCell>
      <TableCell className="text-center">
        {
          <div className="flex justify-center flex-row gap-2 border border-black rounded p-1 px-2">
            <button onClick={addItem}>+</button>
            <div>{quantitynew}</div>
            <button onClick={subItem}>-</button>
          </div>
        }
      </TableCell>
      <TableCell className="text-center">
        {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
        {convertPrice((product?.Price * quantitynew).toFixed(2), currency)}
      </TableCell>
      <TableCell>
        <button onClick={deleteItem}>X</button>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
