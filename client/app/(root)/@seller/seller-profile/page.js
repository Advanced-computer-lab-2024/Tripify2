"use client";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Description: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!session?.user?.userId) return;

        const response = await fetcher(`/users/${session.user.userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setProfile(data);

        const sellerResponse = await fetcher(`/sellers/user/${session.user.userId}`);
        if (!sellerResponse.ok) throw new Error("Failed to fetch seller profile");
        const sellerData = await sellerResponse.json();
        const { Seller } = sellerData;

        setSellerProfile(Seller);

        setFormData({
          UserName: data.UserName || "",
          Email: data.Email || "",
          Description: Seller?.Description || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Error fetching profile");
      }
    };

    fetchUserProfile();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        const usersResponse = await fetcher(`/users`);
        if (!usersResponse.ok) {
            throw new Error("Failed to fetch users");
        }
        const existingUsers = await usersResponse.json();

        const isUsernameTaken = existingUsers.some(user => user.UserName === formData.UserName && user._id !== profile._id);
        const isEmailTaken = existingUsers.some(user => user.Email === formData.Email && user._id !== profile._id);

        if (isUsernameTaken) {
            setError("Username is already taken.");
            return;
        }

        if (isEmailTaken) {
            setError("Email is already taken.");
            return;
        }

        const userResponse = await fetcher(`/users/${session?.user?.userId}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              UserName: formData.UserName,
              Email: formData.Email,
          }),
      });
      
      if (!userResponse.ok) {
          throw new Error("Failed to update user profile");
      }
      
      const sellerResponse = await fetcher(`/sellers/${sellerProfile?._id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              Description: formData.Description,
          }),
      });
      



        const updatedProfile = await userResponse.json();
        const updatedSellerProfile = await sellerResponse.json();

        setProfile(updatedProfile);
        setSellerProfile(updatedSellerProfile.Seller);

        setIsEditing(false);
        setSuccess(true);

        setTimeout(() => {
            setSuccess(false);
        }, 1000);
    } catch (error) {
        console.error("Error updating profile:", error);
        setError(error.message || "Error updating profile");
    } finally {
        setLoading(false);
    }
};



  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>My Profile</h1>

      {isEditing ? (
        <>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="UserName"
              value={formData.UserName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              style={styles.textArea}
            />
          </div>
          <button onClick={handleSave} style={styles.saveButton} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          {success && <p style={styles.successMessage}>Profile updated successfully!</p>}
          {error && <p style={styles.errorMessage}>{error}</p>}
        </>
      ) : (
        <>
          <p><strong>Username:</strong> {profile?.UserName || "N/A"}</p>
          <p><strong>Email:</strong> {profile?.Email || "N/A"}</p>
          <p><strong>Description:</strong> {sellerProfile?.Description || "N/A"}</p>

          <button onClick={() => setIsEditing(true)} style={styles.editButton}>
            Edit Profile
          </button>
        </>
      )}
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
  textArea: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    height: "80px",
    resize: "vertical",
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: "black",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "black",
    color: "white",
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
