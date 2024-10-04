'use client'

export default function Allproducts({ products }) {
  console.log(products); // Log to inspect the products array

  if (!products || products.length === 0) {
    return <h2>No products available.</h2>;
  }

  return (
    <div>
      {products.map((eachproduct) => (
        <h1 key={eachproduct._id}>{eachproduct.Name}</h1> // Render all products directly
      ))}
    </div>
  );
}
