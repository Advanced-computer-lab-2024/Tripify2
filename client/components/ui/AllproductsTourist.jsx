"use client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useRouter } from "next/navigation";

export default function AllproductsTourist({ products, searchQuery, currentMaxPrice }) {
  const { currency } = useCurrencyStore();

  const router = useRouter();

  // console.log(products);

  console.log("Max Price: ", currentMaxPrice)
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
};
