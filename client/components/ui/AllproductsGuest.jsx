"use client";
import { useRouter } from "next/navigation";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AllproductsGuest({ products, searchQuery }) {
  const { currency } = useCurrencyStore();

  const router = useRouter();

  // console.log(products);

  const filteredProducts = products?.filter(
    (product) =>
      product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.Price.toString().includes(searchQuery)
  );

  if (!filteredProducts || filteredProducts.length === 0) {
    return <h2>No products found.</h2>;
  }

  const handleViewDetails = (id) => {
    router.push(`/products-guest/${id}`);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-6">
      {filteredProducts.map((eachproduct) => (
        <Card
          key={eachproduct._id}
          className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100 flex flex-col"
          onClick={() => handleViewDetails(eachproduct._id)}
        >
          <CardHeader className="flex-grow justify-between relative">
            <img
              src={eachproduct.Image}
              alt={eachproduct.Name}
              className="object-cover w-full h-48 mb-2 rounded-lg"
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg font-bold">
              {eachproduct.Name}
            </CardTitle>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="mr-1">{eachproduct.Rating}</span>
              </div>
            </div>
            <CardDescription className="text-sm text-black-600">
              Price:{" "}
              {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}
              {convertPrice(eachproduct.Price, currency)}
            </CardDescription>
          </CardContent>
        </Card>
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
