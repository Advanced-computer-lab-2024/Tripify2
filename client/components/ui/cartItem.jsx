"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetcher } from "@/lib/fetch-client";
import { getSession } from "@/lib/session";

const CartItem = ({ product, quantity, cart ,touristId, setCart}) => {
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
    console.log(product.AvailableQuantity)
    console.log(quantitynew+1)
    if (product.AvailableQuantity >= quantitynew+1){
    const newCart = cart.map(item =>
      item.product._id == product._id
        ? {product: item.product._id, quantity: quantitynew+1}
        : {product: item.product._id, quantity: item.quantity}
    );

    try{const touristRes = await fetcher(`/tourists/${touristId}`, {
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
    setCart(old => cart.map(item =>
      item.product._id == product._id
        ? {...item, quantity: quantitynew+1}
        : item
    ))
    }
    else{
      alert("cannot add more items (out of stock)")
    }
  };


  const subItem = async () => {
    const touristId = session.current?.user?.id;

    if (quantitynew - 1 == 0){
      let newCart = [];
      for(let i =0 ; i<cart.length ; i++){
        if ( cart[i].product._id !== product._id){
          newCart.push({product: cart[i].product._id, quantity: cart[i].quantity})
        }
      }
      const touristRes = await fetcher(`/tourists/${touristId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Cart: newCart}),
      });
  
      if (!touristRes.ok) throw new Error("Network response was not ok");

      let finalcart = []
      for(let i =0 ; i<cart.length ; i++){
        if ( cart[i].product._id !== product._id){
          finalcart.push(cart[i])
        }
      }
      setCart(finalcart)
    }
    else{
      const newCart = cart.map(item =>
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
      setCart(cart.map(item =>
        item.product._id == product._id
          ? {...item, quantity: quantitynew-1}
          : item
      ))
    }
  };

  const deleteItem = async () => {
    const touristId = session.current?.user?.id;
      let newCart = [];
      for(let i =0 ; i<cart.length ; i++){
        if ( cart[i].product._id !== product._id){
          newCart.push(cart[i])
        }
      }
      const touristRes = await fetcher(`/tourists/${touristId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Cart: newCart}),
      });
  
      if (!touristRes.ok) throw new Error("Network response was not ok");
      setCart(newCart)
  }

  return (
    <div className="flex flex-row justify-center items-center gap-20 p-2 px-4 shadow-md w-2/3 rounded">
      <img src={product.Image} className="w-16 h-16 rounded" alt={product.Name} />
      <div>{product.Name}</div>
      <div>{product.Price}</div>
      <div className="flex flex-row gap-2 border border-black rounded p-1 px-2">
        <button onClick={addItem}>+</button>
        <div>{quantitynew}</div>
        <button onClick={subItem}>-</button>
      </div>
      <div>{product.Price * quantitynew}</div>
      <button onClick={deleteItem}>x</button>
    </div>
  );
};

export default CartItem;
