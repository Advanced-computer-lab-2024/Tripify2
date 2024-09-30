import Allproducts from "@/components/ui/Allproducts";

export default async function products() {
  const response = await fetch("http://localhost:3001/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const products = await response.json();

  return (
    <div>
      <Allproducts products={products} />
      
    </div>
  );
}

