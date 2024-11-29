"use client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";

export default function AllproductsTourist({ products, searchQuery, currentMaxPrice, wishlist, cart }) {
  // const session = useSession();
  // const id = session?.data?.user?.id;
  const { currency } = useCurrencyStore();
  const [WishList, setWishlist] = useState(wishlist);
  const [Cart, setCart] = useState(cart);
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session status and data
  
  // console.log(products);
  useEffect(()=>{
    setCart(wishlist);
  },[wishlist]);

  useEffect(()=>{
    setCart(cart);
  },[cart]);

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

  


  const UpdateWishList = debounce(async (userId,UpdatedWishList) => {
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

      console.log({"All Products" :await res.json()});

    } catch (e) {
      console.error("Error fetching tourist's wishlist:", e);
    }
  },300);

  // console.log("Max Price: ", currentMaxPrice)
  products.forEach((product) => console.log("Price: ", Number(convertPrice(product.Price, currency)) <= currentMaxPrice));
  const filteredProducts = products?.filter(
    (product) =>
      product.Name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      // product.Price.toString().includes(searchQuery)
      Number(convertPrice(product.Price, currency)) <= currentMaxPrice
  );

  

  if (!filteredProducts || filteredProducts.length === 0) {
    return <h2>No products found.</h2>;
  }

  const handleViewDetails = (id) => {
    router.push(`/products-tourist/${id}`);
  };

  const toggleWishlist = (productId) => {
    let x;
    setWishlist((prevWishlist) =>{
      prevWishlist.includes(productId)
        ?x= prevWishlist.filter((id) => id !== productId) 
        : x=[...prevWishlist, productId] 
      UpdateWishList(session.user.id, x);
      return x;
      }
    );
  };

  const addToCart = async (productId, availablequantity) => {   
    let newcart = [].concat(Cart);
    let flag = false;
    console.log("before")
    console.log(newcart)
    let currentquantity = 1;
      for (let i = 0; i<newcart.length; i++){
        if (productId == newcart[i].product){
          flag = true;
          newcart[i].quantity += 1;
          currentquantity = newcart[i].quantity;
        }
      }
      if (flag == false){
        newcart.push({product: productId, quantity: 1})
      }
      console.log("after")
      console.log(newcart)
    if (availablequantity >= currentquantity){
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
      alert("added to cart")
      console.log("add")
      console.log(newcart)
      setCart(newcart)
    }
    else{
      alert("item out of stock")
    }
  };

  return (
    <div style={styles.productGrid}>
      {filteredProducts.map((eachproduct) => (
        <div key={eachproduct._id} style={styles.productCard}>
          <h2 style={styles.productName}>{eachproduct.Name}</h2>
          <p style={styles.productPrice}>Price: {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}{convertPrice(eachproduct.Price, currency)}</p>
          <button
            style={styles.detailsButton}
            onClick={() => handleViewDetails(eachproduct._id)}
          >
            View Details
          </button>
          <button
              style={styles.wishlistButton}
              onClick={() => toggleWishlist(eachproduct._id)}
            >
              <span
                style={
                  WishList.includes(eachproduct._id)
                    ? styles.heartActive
                    : styles.heart
                }
              >
                ♥
              </span>
            </button>
            <button className="mt-2 border rounded-md bg-black text-white p-2 px-4" onClick={() => addToCart(eachproduct._id, eachproduct.AvailableQuantity)}>
              Add To Cart
            </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  productCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    textAlign: "center",
    transition: "transform 0.2s",
  },
  productName: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  productPrice: {
    fontSize: "16px",
    color: "#888",
    marginBottom: "15px",
  },
  detailsButton: {
    padding: "10px 20px",
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  wishlistButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    marginLeft: '0.5rem',
  },
  heart: {
    color: 'gray',
  },
  heartActive: {
    color: 'red',
  },
};
