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
  const [uniqueError, setUniqueError] = useState({ UserName: null, Email: null });

  const [formData, setFormData] = useState({
    UserName: "",
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
          UserName: data.UserName || "",
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

  const checkUniqueFields = async () => {
    try {
      // Check if the fields have been changed, don't check uniqueness if unchanged
      const isUserNameChanged = formData.UserName !== profile.UserName;
      const isEmailChanged = formData.Email !== profile.Email;

      if (!isUserNameChanged && !isEmailChanged) {
        return true; // No change, skip uniqueness check
      }

      const response = await fetcher("/users/check-uniqueness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: isUserNameChanged ? formData.UserName : null,
          Email: isEmailChanged ? formData.Email : null,
        }),
      });

      const result = await response.json();
      if (result.exists) {
        setUniqueError({
          UserName: result.conflict === "UserName" ? "Username already taken. Please choose another." : null,
          Email: result.conflict === "Email" ? "Email already in use. Please use a different email." : null,
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Username or Email is already in use.", error);
      setError("Username or Email is already in use.");
      return false;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setPasswordError(null);
    setUniqueError({ UserName: null, Email: null });

    try {
      const isUnique = await checkUniqueFields();
      if (!isUnique) {
        setLoading(false);
        return;
      }

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
          UserName: formData.UserName,
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
            {uniqueError.UserName && <p style={styles.errorMessage}>{uniqueError.UserName}</p>}
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
            {uniqueError.Email && <p style={styles.errorMessage}>{uniqueError.Email}</p>}
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
          <p><strong>Username:</strong> {profile?.UserName || "N/A"}</p>
          <p><strong>Email:</strong> {profile?.Email || "N/A"}</p>
          <p><strong>Password:</strong> {"********"} {/* Masked password display */}</p>

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
