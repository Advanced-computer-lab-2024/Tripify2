"use client"; // Marking this component as a Client Component

import { useEffect, useState } from 'react';
import { fetcher } from "@/lib/fetch-client";

export default function ProductDetail({ params }) {
  const { id } = params; 
  const [product, setProduct] = useState(null);
  const [sellerName, setSellerName] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState({
    Name: '',
    Price: '',
    Description: '',
    Image: '',
    AvailableQuantity: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetcher(`/products/${id}`);
        let data = await response.json();

        const stringifiedProductData = JSON.stringify(data);
        console.log("Stringified Product Data: ", stringifiedProductData); 

        setProduct(data);
        setFormData({
          Name: data.Name || '',
          Price: data.Price || '',
          Description: data.Description || '',
          Image: data.Image || '',
          AvailableQuantity: data.AvailableQuantity || ''
        });

        if (data.Seller) {
          const sellerResponse = await fetcher(`/sellers/${data.Seller}`);
          const sellerData = await sellerResponse.json();

          const stringifiedSellerData = JSON.stringify(sellerData);
          console.log("Stringified Seller Data: ", stringifiedSellerData); 

          setSellerName(sellerData.Name); 
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      console.log("Sending PATCH request with data: ", formData);
  
      const response = await fetcher(`/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: formData.Name,
          Price: formData.Price,
          Description: formData.Description,
          Image: formData.Image,
          AvailableQuantity: formData.AvailableQuantity
        })
      });
  
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
  
      const updatedProduct = await response.json();
      console.log("Product updated successfully: ", updatedProduct);
  
      setProduct(updatedProduct); 
      setIsEditing(false); 
    } catch (error) {
      console.error("Error updating product details: ", error);
    }
  };
  
  if (!product) {
    return <div>Couldn't Fetch Details</div>;
  }

  return (
    <div style={styles.container}>
      {isEditing ? (
        <>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Product Name"
            style={styles.input}
          />
          <input
            type="text"
            name="Price"
            value={formData.Price}
            onChange={handleChange}
            placeholder="Price"
            style={styles.input}
          />
          <input
            type="text"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            placeholder="Description"
            style={styles.input}
          />
          <input
            type="text"
            name="Image"
            value={formData.Image}
            onChange={handleChange}
            placeholder="Image URL"
            style={styles.input}
          />
          <input
            type="text"
            name="AvailableQuantity"
            value={formData.AvailableQuantity}
            onChange={handleChange}
            placeholder="Available Quantity"
            style={styles.input}
          />
          <button onClick={handleSave} style={styles.saveButton}>Save</button>
        </>
      ) : (
        <>
          <h1>{product.Name}</h1>
          {product.Image && <img src={product.Image} alt={product.Name} style={styles.image} />}
          <p>Price: ${product.Price}</p>
          <p>Description: {product.Description}</p>
          <p>Rating: {product.Rating}</p>
          <p>Available Quantity: {product.AvailableQuantity}</p>
          <button onClick={handleEdit} style={styles.editButton}>Edit</button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  editButton: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};
