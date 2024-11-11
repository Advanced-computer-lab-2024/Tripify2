"use client";
import { useState, useRef } from "react";
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";
import { useUploadThing } from "@/lib/uploadthing-hook";
import Image from "next/image";
import { UploadIcon } from "lucide-react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { startUpload } = useUploadThing('imageUploader')
  const inputRef = useRef(null)

  const session = useSession();
  const createProduct = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const imageUploadResult = await startUpload([image])

    const Image = imageUploadResult[0].url

    try {
      const response = await fetcher("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          Image: Image,
          Price: parseFloat(price),
          Description: description,
          AvailableQuantity: quantity,
          Seller: session?.data?.user?.userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product.");
      }

      setSuccess(true);
      setName("");
      setImage("");
      setPrice(0);
      setDescription("");
      setQuantity(0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct();
  };

  return (
    <div style={styles.container}>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Image URL:</label>
          {image ? (
            <div onClick={() => inputRef.current.click()} className='relative w-16 h-16 overflow-hidden rounded-full cursor-pointer'>
              <Image width={64} height={64} src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="tourguide image" />
              <input
                type="file"
                accept="image/*"
                ref={inputRef}
                name="Image"
                onChange={(e) => {
                  setImage(e.target.files[0])
                }}
                className="z-10 hidden w-full h-full"
              />
            </div>
          ) : (
            <div onClick={() => inputRef.current.click()} className='relative flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-300 rounded-full cursor-pointer'>
              <UploadIcon size={24} />
              <input
                type="file"
                accept="image/*"
                ref={inputRef}
                name="Image"
                onChange={(e) => {
                  setImage(e.target.files[0])
                }}
                className="z-10 hidden w-full h-full"
              />
            </div>
          )}
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Available Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
        {success && <p style={styles.successMessage}>Product created successfully!</p>}
        {error && <p style={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
  },
  textarea: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    minHeight: "100px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  successMessage: {
    color: "green",
    marginTop: "10px",
  },
  errorMessage: {
    color: "red",
    marginTop: "10px",
  },
};
