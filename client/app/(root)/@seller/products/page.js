"use client";
import { useEffect, useState } from "react";
import Allproducts from "@/components/ui/Allproducts";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice] = useState(0); // Fixed min price
  const [maxPrice, setMaxPrice] = useState(100); // Default max price for the slider
  const [currentMaxPrice, setCurrentMaxPrice] = useState(100); // Slider-controlled price

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
      setProducts(data);
      setFilteredProducts(data);

      // Extract max price from products
      const prices = data.map((product) => product.Price);
      const maxPrice = Math.max(...prices);

      setMaxPrice(maxPrice);
      setCurrentMaxPrice(maxPrice); // Set slider default to max price
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Filter products based on the selected price range
  const filterByPrice = () => {
    const filtered = products.filter(
      (product) => product.Price >= minPrice && product.Price <= currentMaxPrice
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();

    const intervalId = setInterval(() => {
      fetchProducts();
    }, 60000); // Fetch every minute

    return () => clearInterval(intervalId);
  }, []);

  // Reapply price filter when max price changes
  useEffect(() => {
    filterByPrice();
  }, [currentMaxPrice]);

  return (
    <div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />

      {/* Single Price Slider */}
      <div style={styles.filterContainer}>
        <div>
          <label>Max Price: ${currentMaxPrice.toFixed(2)}</label> {/* Display float with 2 decimals */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="0.01" // Allow increments by 0.01 for floating-point numbers
            value={currentMaxPrice}
            onChange={(e) => setCurrentMaxPrice(parseFloat(e.target.value))} // Parse as float
            style={styles.slider}
          />
        </div>
      </div>

      {/* Pass filtered products and search query */}
      <Allproducts products={filteredProducts} searchQuery={searchQuery} />
    </div>
  );
}

// Add styles for the sliders and other elements
const styles = {
  searchInput: {
    padding: "8px",
    margin: "10px 0",
    fontSize: "14px",
    width: "50%",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  filterContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    alignItems: "center",
  },
  slider: {
    width: "300px",
    margin: "10px",
  },
};
