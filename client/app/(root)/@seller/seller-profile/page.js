"use client";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
    CurrentPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!session?.user?.userId) return;

        const response = await fetcher(`/users/${session.user.userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setProfile(data);

        setFormData({
          Email: data.Email || "",
          Password: "",
          CurrentPassword: "",
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
    setPasswordError(null);

    try {
      if (formData.Password && !formData.CurrentPassword) {
        setPasswordError("Please enter your current password to change it");
        setLoading(false);
        return;
      }

      const response = await fetcher(`/users/${session?.user?.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.Email,
          ...(formData.Password && { Password: formData.Password }),
          CurrentPassword: formData.CurrentPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData?.message === "Incorrect current password") {
          setPasswordError("Incorrect current password");
          setLoading(false);
          return;
        }
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile");
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
      <p><strong>Email:</strong> {profile?.Email || "N/A"}</p>

      {isEditing ? (
        <>
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
            <label style={styles.label}>Current Password:</label>
            <input
              type="password"
              name="CurrentPassword"
              value={formData.CurrentPassword}
              onChange={handleChange}
              placeholder="Enter current password to change it"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password:</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Leave blank to keep unchanged"
              style={styles.input}
            />
          </div>
          <button onClick={handleSave} style={styles.saveButton} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          {success && <p style={styles.successMessage}>Profile updated successfully!</p>}
          {error && <p style={styles.errorMessage}>{error}</p>}
          {passwordError && <p style={styles.passwordError}>{passwordError}</p>}
        </>
      ) : (
        <>
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
    backgroundColor: "black",
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
  passwordError: {
    color: "orange",
    marginTop: "10px",
  },
};
