"use client"
import React, { useEffect, useState } from 'react'
import CartItem from './cartItem'
import { useRouter } from 'next/navigation'

function cartPage({Cart, touristId}) {
    const [cart, setCart] = useState(Cart)
    const router = useRouter();
    console.log(cart)
    let sum = 0;
    for (let i =0; i<cart.length; i++){
      sum += cart[i].product.Price * cart[i].quantity;
    }
    console.log(sum)

    useEffect(() => {
      setCart(cart);
    }, [cart]);

    const items  = cart.map(item => <CartItem product={item.product} quantity={item.quantity} cart={cart} setCart={setCart} touristId={touristId}/>)
  return (
    <div className='p-6 px-14'>
      <h1 className='text-2xl font-bold'>My Cart</h1>
      <div className='flex flex-col items-center p-4 py-2'>
      <ul className='flex flex-row justify-center items-center gap-20 p-2 px-4 shadow-md w-2/3 rounded'>
        <li>image</li>
        <li>name</li>
        <li>price</li>
        <li>quantity</li>
        <li>total</li>
      </ul>
        {items.length!=0? items: <span>Cart is empty</span>}
        <div className='flex flex-row gap-4 items-center p-4 '>
          <div className="bg-slate-200 rounded-md text-sm font-medium h-10 px-4 py-2">Total: {sum}</div>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium h-10 px-4 py-2" onClick={()=>{router.push("/checkout")}}>Check Out</button>
        </div>
      </div>
    </div>
  )
}

export default cartPage
