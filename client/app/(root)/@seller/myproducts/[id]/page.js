"use client"; 

import { useEffect, useState } from 'react';
import { fetcher } from "@/lib/fetch-client";
import { useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox"

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

  const router = useRouter(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetcher(`/products/${id}`);
        let data = await response.json();

        setProduct(data);
        setFormData({
          Name: data.Name || '',
          Price: data.Price || '',
          Description: data.Description || '',
          Image: data.Image || '',
          AvailableQuantity: data.AvailableQuantity || '',
          Archived: data.Archived || false
        });

        if (data.Seller) {
          const sellerResponse = await fetcher(`/sellers/${data.Seller}`);
          const sellerData = await sellerResponse.json();
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

  const handleEdit = () => {
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
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
  
      const updatedProduct = await response.json();
      setProduct(updatedProduct); 
      setIsEditing(false); 
    } catch (error) {
      console.error("Error updating product details: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetcher(`/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      console.log("Product deleted successfully");

      router.push('/myproducts'); 
    } catch (error) {
      console.error("Error deleting product: ", error);
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
          <div className="flex items-center gap-2">
              <label
                  htmlFor="archived"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                  Archived
              </label>
              <Checkbox
                  checked={formData.Archived}
                  onCheckedChange={(checked) => handleChange({ target: { name: 'Archived', value: checked } })}
                  id="archived"
              />
          </div>
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
          <p>Total Sales: {product.TotalSales}</p>
          <p>Archived: {product.Archived ? 'Yes' : 'No'}</p>
          <button onClick={handleEdit} style={styles.editButton}>Edit</button>
          <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
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
    marginRight: '10px', 
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};
