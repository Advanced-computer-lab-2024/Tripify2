"use client"; // Marking this component as a Client Component

import { useEffect, useState } from 'react';
import Allproducts from "@/components/ui/Allproducts";

export default function Products() {
  const [products, setProducts] = useState([]);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
  const response = await fetch("http://localhost:3001/products", {
    headers: {
      "Content-Type": "application/json",
          "Cache-Control": "no-cache", 
          "Accept": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
      const data = await response.json();
      setProducts(data); // Update state with fetched products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProducts();

    // Set up interval to fetch every minute
    const intervalId = setInterval(() => {
      fetchProducts();
    }, 1000); // 60000 ms = 1 minute

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Allproducts products={products} />
      
    </div>
  );
}

