import React from 'react'
import CartPage from "../../../../components/ui/cartPage"
import { getSession } from "@/lib/session";

async function cartList() {
    const session = await getSession();
    const touristId = session?.user?.id;
    const productRes = await fetcher(`/tourist/getcart/${touristId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((e) => console.log(e));
    
      if (!productRes.ok) {
        throw new Error("Network response was not ok");
      }
      const cart = await productRes.json();

  return (
    <CartPage cart={cart}/>
  )
}

export default cartList
