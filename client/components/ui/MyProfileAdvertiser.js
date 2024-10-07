"use client";
import React, { useState } from "react";
import Dashboard from "@/components/ui/dashboard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { fetcher } from "@/lib/fetch-client";
("");

export default function AdvertiserProfile({ advertiser }) {
  const session = useSession();
  const id = session?.data?.user?.id;
  console.log("iddd", id);
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProfileCreateMode, setIsProfileCreateMode] = useState(false);
  const [isProfileEditMode, setIsProfileEditMode] = useState(false);
  const [formData, setFormData] = useState({
    UserName: advertiser.advertiser.UserId?.UserName || "",
    Email: advertiser.advertiser.UserId?.Email || "",
    Website: advertiser.advertiser.Website || "",
    Hotline: advertiser.advertiser.Hotline || "",
    CompanyProfile: advertiser.advertiser.CompanyProfile || "",
    Document: advertiser.advertiser.Document || "",
  });

  const [profileformData, setProfileFormData] = useState({
    Name: advertiser?.advertiser?.CompanyProfile?.Name,
    Industry: advertiser?.advertiser?.CompanyProfile?.Industry,
    FoundedDate: advertiser?.advertiser?.CompanyProfile?.FoundedDate,
    Headquarters: advertiser?.advertiser?.CompanyProfile?.Headquarters,
    Description: advertiser?.advertiser?.CompanyProfile?.Description,
    Website: advertiser?.advertiser?.CompanyProfile?.Website,
    Email: advertiser?.advertiser?.CompanyProfile?.Email,
  });

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsProfileCreateMode(false);
    setIsProfileEditMode(false);
  };

  const handleCreateCompanyProfileClick = () => {
    setIsEditMode(false);
    setIsProfileCreateMode(true);
    setIsProfileEditMode(false);
  };

  const handleEditCompanyProfileClick = () => {
    setIsEditMode(false);
    setIsProfileCreateMode(false);
    setIsProfileEditMode(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleProfileInputChange = (e) => {
    setProfileFormData({
      ...profileformData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("Test");
    // console.log(formData);
    try {
      console.log(session?.data?.user?.id);
      const response = await fetcher(
        `/advertisers/${session?.data?.user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // console.log(response);

      if (response.ok) {
        const result = await response.json();
        console.log("Advertiser updated successfully:", result);
        //   setIsEditMode(false);
      } else {
        alert("Error updating advertiser");
        console.error("Error updating advertiser");
      }
    } catch (error) {
      console.error("Failed to update advertiser:", error);
    }
    router.refresh();
    setIsEditMode(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (isProfileCreateMode) {
      try {
        const response = await fetcher(`/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...profileformData, AdvertiserId: id }),
        });

        // console.log(response);

        if (response.ok) {
          const result = await response.json();
          console.log("Profile Created successfully:", result);
          router.refresh();
          //   setIsEditMode(false);
        } else {
          const errorData = await response.json(); // Extract the response body
          console.log(errorData); // Log the full error response
          alert(errorData.message || "An error occurred");
        }
      } catch (error) {
        console.error("Failed to create profile:", error);
      }
      setIsProfileCreateMode(false);
    } else if (isProfileEditMode) {
      try {
        console.log(`/profile`);
        const response = await fetcher(`/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...profileformData,
            id: formData.CompanyProfile._id,
          }),
        });

        // console.log(response);

        if (response.ok) {
          const result = await response.json();
          console.log("Profile Updated successfully:", result);
        } else {
          const errorData = await response.json(); // Extract the response body
          console.log(errorData); // Log the full error response
          alert(errorData.message || "An error occurred");
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
      router.refresh();
      setIsProfileEditMode(false);
    }
  };

  return (
    <div>
      <header>
        <Dashboard params={{ role: "Advertiser" }} />
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Advertiser Profile</h1>

          {isEditMode ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  <strong>Name:</strong>
                  <input
                    type="text"
                    name="UserName"
                    value={formData.UserName}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Email:</strong>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Website:</strong>
                  <input
                    type="text"
                    name="Website"
                    value={formData.Website}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Hotline:</strong>
                  <input
                    type="text"
                    name="Hotline"
                    value={formData.Hotline}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Document:</strong>
                  <input
                    type="text"
                    name="Document"
                    value={formData.Document}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
              >
                Save
              </button>
            </form>
          ) : (
            <div>
              <p>
                <strong>Name:</strong>{" "}
                {advertiser.advertiser.UserId?.UserName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {advertiser.advertiser.UserId?.Email || "N/A"}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                {advertiser.advertiser.Website || "N/A"}{" "}
              </p>
              <p>
                <strong>Hotline:</strong> {advertiser.advertiser.Hotline}
              </p>
              <p>
                <strong>Document:</strong> {advertiser.advertiser.Document}
              </p>

              <button
                onClick={handleEditClick}
                className="bg-yellow-500 text-white py-2 px-4 mt-4 rounded"
              >
                Edit
              </button>
              <div>
                <hr className="m-4" />
              </div>

              <div>
                <label>
                  <strong>CompanyProfile:</strong>
                  <div>
                    {(formData?.CompanyProfile && isProfileEditMode) ||
                    (!formData?.CompanyProfile && isProfileCreateMode) ? (
                      <form onSubmit={handleProfileSubmit}>
                        <div>
                          <label>
                            <strong>Name:</strong>
                            <input
                              type="text"
                              name="Name"
                              value={profileformData.Name}
                              onChange={handleProfileInputChange}
                              className="border p-2 w-full"
                            />
                          </label>
                          <label>
                            <strong>Industry:</strong>
                            <input
                              type="text"
                              name="Industry"
                              value={profileformData.Industry}
                              onChange={handleProfileInputChange}
                              className="border p-2 w-full"
                            />
                          </label>
                          <label>
                            <strong>Founded Date:</strong>
                            <input
                              type="date"
                              name="FoundedDate"
                              value={
                                profileformData.FoundedDate
                                  ? format(
                                      new Date(profileformData.FoundedDate),
                                      "yyyy-MM-dd"
                                    )
                                  : ""
                              }
                              onChange={handleProfileInputChange}
                              className="border p-2 w-full mb-4"
                              required
                            />
                          </label>
                          <label>
                            <strong>Headquarters:</strong>
                            <input
                              type="text"
                              name="Headquarters"
                              value={profileformData.Headquarters}
                              onChange={handleProfileInputChange}
                              className="border p-2 w-full"
                            />
                          </label>
                          <label>
                            <strong>Description:</strong>
                            <input
                              type="text"
                              name="Description"
                              value={profileformData.Description}
                              onChange={handleProfileInputChange}
                              className="border p-2 w-full"
                            />
                          </label>
                          <label>
                            <strong>Website:</strong>
                            <input
                              type="text"
                              name="Website"
                              value={profileformData.Website}
                              onChange={handleProfileInputChange}
                              className="border p-2 w-full"
                            />
                          </label>
                          <label>
                            <strong>Email:</strong>
                            <input
                              type="text"
                              name="Email"
                              value={profileformData.Email}
                              onChange={handleProfileInputChange}
                              className="border p-2 w-full"
                            />
                          </label>
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                        >
                          Save
                        </button>
                      </form>
                    ) : formData.CompanyProfile ? (
                      <div>
                        <p>
                          <strong>Name:</strong>{" "}
                          {formData?.CompanyProfile?.Name || "N/A"}
                        </p>
                        <p>
                          <strong>Industry:</strong>{" "}
                          {formData?.CompanyProfile?.Industry || "N/A"}
                        </p>
                        <p>
                          <strong>FoundedDate:</strong>{" "}
                          {formData?.CompanyProfile?.FoundedDate || "N/A"}
                        </p>
                        <p>
                          <strong>Headquarters:</strong>{" "}
                          {formData?.CompanyProfile?.Headquarters || "N/A"}
                        </p>
                        <p>
                          <strong>Description:</strong>{" "}
                          {formData?.CompanyProfile?.Description || "N/A"}
                        </p>
                        <p>
                          <strong>Website:</strong>{" "}
                          {formData?.CompanyProfile?.Website || "N/A"}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {formData?.CompanyProfile?.Email || "N/A"}
                        </p>
                        <button
                          onClick={handleEditCompanyProfileClick}
                          className="bg-yellow-500 text-white py-2 px-4 mt-4 rounded"
                        >
                          Edit Company Profile
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleCreateCompanyProfileClick}
                        className="bg-yellow-500 text-white py-2 px-4 mt-4 rounded"
                      >
                        Create Company Profile
                      </button>
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
