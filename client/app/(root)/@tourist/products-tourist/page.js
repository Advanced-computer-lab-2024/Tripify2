"use client";
import { useEffect, useState } from "react";
import AllproductsTourist from "@/components/ui/AllproductsTourist";
import { fetcher } from "@/lib/fetch-client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useSession } from "next-auth/react";

export default function Products() {
  const { currency } = useCurrencyStore();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [currentMaxPrice, setCurrentMaxPrice] = useState(100);
  const [sortOption, setSortOption] = useState("none");
  const [WishList1, setWishList] = useState([]);
  const { data: session, status } = useSession(); // Get session status and data
  const fetchProducts = async () => {
    try {
      const response = await fetcher("/products", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.json();

      const stringifiedData = JSON.stringify(data);

      // console.log("Stringified Data: ", stringifiedData);

      setProducts(data.filter((product) => !product.Archived));
      setFilteredProducts(data.filter((product) => !product.Archived));

      const prices = data.map((product) =>
        convertPrice(product.Price, currency)
      );
      const maxPrice = Math.max(...prices);
      setMaxPrice(maxPrice);
      setCurrentMaxPrice(maxPrice);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchTourist = async (userId) => {
    try {
      const res = await fetcher(`/tourists/${userId}`).catch((e) =>
        console.error("Error fetching tourist:", e)
      );

      if (!res.ok) {
        const resError = await res.json();
        console.log(resError);
        return <>error</>;
      }

      const Tourist = await res.json();
      setWishList(Tourist.Wishlist);
      setCart(Tourist.Cart);
      console.log("WENT BACK", Tourist.Wishlist);
    } catch (e) {
      console.error("Error fetching tourist:", e);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchTourist(session?.user?.id);
  }, [status, session?.user?.id]);

  const filterByPrice = () => {
    const filtered = products.filter(
      (product) => product.Price >= minPrice && product.Price <= currentMaxPrice
    );
    sortProducts(filtered);
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
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterByPrice();
  }, [currentMaxPrice]);

  return (
    <div className="grid h-screen grid-cols-6 gap-4">
      <div className="col-span-1 p-4">
        <h2 className="mb-6 text-lg font-bold text-black">Filter</h2>

        <div className="mb-4">
          <label htmlFor="priceRange" className="mb-2 text-black">
            <span className="font-bold">Price: </span>
            <span className="ml-2">
              {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}
              {currentMaxPrice.toFixed(2)}
            </span>
          </label>
          <input
            id="priceRange"
            type="range"
            className="w-full range"
            min={minPrice}
            max={maxPrice}
            step="0.01"
            value={currentMaxPrice}
            onChange={(e) => setCurrentMaxPrice(parseFloat(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label>
            <span className="mb-2 text-black font-bold mr-2">Rating: </span>
          </label>
          <div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded"
            >
              <option value="none">None</option>
              <option value="lowToHigh">Lowest to Highest</option>
              <option value="highToLow">Highest to Lowest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="col-span-5 p-4 overflow-auto">
        <h2 className="mb-4 text-2xl font-bold text-black">Products</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <AllproductsTourist
          products={filteredProducts}
          searchQuery={searchQuery}
          currentMaxPrice={currentMaxPrice}
          wishlist={WishList1}
          cart={cart}
        />
      </div>
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
