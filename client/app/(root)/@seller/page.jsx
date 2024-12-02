
// 'use client'
// import LogoutBtn from '@/components/ui/LogoutBtn';
// import { useRouter } from 'next/navigation';


// const Dashboard = () => {
//   const router = useRouter();

//   // Function to handle profile button click


//   // Function to handle products button click
//   const handleProductsClick = () => {
//     router.push('/products'); // Redirect to the products page (update the path if necessary)
//   };
//   const handlemyProductsClick = () => {
//     router.push('/myproducts'); // Redirect to the products page (update the path if necessary)
//   };
//   const handlecreateProductClick = () => {
//     router.push('/createproduct'); // Redirect to the products page (update the path if necessary)
//   };
//   const handleprofileClick = () => {
//     router.push('/seller-profile'); // Redirect to the products page (update the path if necessary)
//   };
//   const handlereportClick = () => {
//     router.push('/sales-report'); // Redirect to the products page (update the path if necessary)
//   };
//   return (
//     <div style={styles.container}>
//       {/* <h1>Seller Dashboard</h1> */}
//       <div style={styles.buttonContainer}>
//         {/* <button style={styles.button} onClick={handleprofileClick}>
//           My Profile
//         </button>
//         <button style={styles.button} onClick={handlemyProductsClick}>
//           View my Products
//         </button>
//         <button style={styles.button} onClick={handleProductsClick}>
//           View All Products
//         </button>
//         <button style={styles.button} onClick={handlecreateProductClick}>
//           Post a Product for Sale
//         </button>
//         <button style={styles.button} onClick={handlereportClick}>
//           Sales Report
//         </button> */}
//         {/* <LogoutBtn /> */}
//       </div>
//     </div>
//   );
// };

// // Styles using inline CSS
// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//   },
//   buttonContainer: {
//     display: 'flex',
//     gap: '20px',
//   },
//   button: {
//     padding: '10px 20px',
//     fontSize: '16px',
//     cursor: 'pointer',
//     backgroundColor: 'black',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//   },
// };

// export default Dashboard;



"use client";
import { useEffect, useState } from "react";
import Allproducts from "@/components/shared/Allproducts";
import { fetcher } from "@/lib/fetch-client"

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [currentMaxPrice, setCurrentMaxPrice] = useState(100);
  const [sortOption, setSortOption] = useState("none"); // State for sorting

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetcher("/products", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.json();

      // Stringify the fetched data
      const stringifiedData = JSON.stringify(data);

      console.log("Stringified Data: ", stringifiedData); // For debugging

      const filteredData = data.filter(product => !product.Archived);

      setProducts(filteredData);
      setFilteredProducts(filteredData);

      // Extract max price from products
      const prices = filteredData.map((product) => product.Price);
      const maxPrice = Math.max(...prices);
      setMaxPrice(maxPrice);
      setCurrentMaxPrice(maxPrice);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filterByPrice = () => {
    const filtered = products.filter(
      (product) => product.Price >= minPrice && product.Price <= currentMaxPrice
    );
    sortProducts(filtered); // Apply sorting after filtering
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    sortProducts(filteredProducts, event.target.value);
  };

  const sortProducts = (productsToSort, sortOrder = sortOption) => {
    let sortedProducts = [...productsToSort];
    if (sortOrder === "lowToHigh") {
      sortedProducts.sort((a, b) => a.Rating - b.Rating);
    } else if (sortOrder === "highToLow") {
      sortedProducts.sort((a, b) => b.Rating - a.Rating);
    }
    setFilteredProducts(sortedProducts);
  };

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(() => {
      fetchProducts();
    }, 60000); // Fetch every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterByPrice(); // Filter and sort when the price changes
  }, [currentMaxPrice]);

  return (
    <div>
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
          <label>Max Price: ${currentMaxPrice.toFixed(2)}</label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="0.01"
            value={currentMaxPrice}
            onChange={(e) => setCurrentMaxPrice(parseFloat(e.target.value))} // Parse as float
            style={styles.slider}
          />
        </div>

        {/* Sort Dropdown */}
        <div>
          <label>Sort by Rating: </label>
          <select value={sortOption} onChange={handleSortChange} style={styles.dropdown}>
            <option value="none">None</option>
            <option value="lowToHigh">Lowest to Highest</option>
            <option value="highToLow">Highest to Lowest</option>
          </select>
        </div>
      </div>

      {/* Pass filtered products and search query */}
      <Allproducts products={filteredProducts} searchQuery={searchQuery} />
    </div>
  );
}

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
  dropdown: {
    padding: "8px",
    fontSize: "14px",
  },
};
