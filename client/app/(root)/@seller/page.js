// Import the Next.js useRouter hook for navigation
'use client'
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  // Function to handle profile button click
 

  // Function to handle products button click
  const handleProductsClick = () => {
    router.push('/Seller/products'); // Redirect to the products page (update the path if necessary)
  };

  return (
    <div style={styles.container}>
      <h1>Seller Dashboard</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button}>
          My Profile
        </button>
        <button style={styles.button} onClick={handleProductsClick}>
          View All Products
        </button>
      </div>
    </div>
  );
};

// Styles using inline CSS
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
};

export default Dashboard;