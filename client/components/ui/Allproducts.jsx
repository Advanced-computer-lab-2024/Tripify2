'use client';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Allproducts({ products }) {
  const router = useRouter(); // Initialize router

  console.log(products); // Log to inspect the products array

  if (!products || products.length === 0) {
    return <h2>No products available.</h2>;
  }

  const handleViewDetails = (id) => {
    router.push(`/products/${id}`); // Navigate to the dynamic product page
  };

  return (
    <div style={styles.productGrid}>
      {products.map((eachproduct) => (
        <div key={eachproduct._id} style={styles.productCard}>
          <h2 style={styles.productName}>{eachproduct.Name}</h2>
          <p style={styles.productPrice}>Price: ${eachproduct.Price}</p>
          <button 
            style={styles.detailsButton}
            onClick={() => handleViewDetails(eachproduct._id)} // Use the defined function
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}

// Styles using inline CSS
const styles = {
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  productName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  productPrice: {
    fontSize: '16px',
    color: '#888',
    marginBottom: '15px',
  },
  detailsButton: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};
