import React from 'react'
import { fetcher } from "@/lib/fetch-client";
import { getSession } from "@/lib/session";
import CartPage from "../../../../components/ui/cartPage";

async function cart() {
  const session = await getSession();
  const touristId = session?.user?.id;

    const response = await fetcher(`/tourists/${touristId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e) => console.log(e));
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const tourist = await response.json();
    const originalCart = tourist.Cart;

    let cart = [];
    if (originalCart.length != 0){
      const productRes = await fetcher(`/tourists/getcart/${touristId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((e) => console.log(e));
    
      if (!productRes.ok) {
        throw new Error("Network response was not ok");
      }
      cart = await productRes.json();
    }

      
  return (
    <CartPage Cart={cart} originalCart={originalCart} touristId={touristId}/>
  )
}

export default cart
