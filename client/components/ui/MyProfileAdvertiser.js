"use client";
import React, { useRef, useState, useEffect } from "react";
import Dashboard from "@/components/ui/dashboard";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { format } from "date-fns";
import { fetcher } from "@/lib/fetch-client";
import { useUploadThing } from "@/lib/uploadthing-hook";
import {
  BriefcaseBusiness,
  Phone,
  ShieldHalf,
  FerrisWheel,
  Mail,
  User,
  TramFront,
  Edit,
  Trash2,
  UploadIcon,
  Network,
  Building2,
  Factory,
  CalendarFold,
  House,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdvertiserProfile({ advertiser }) {
  const session = useSession();
  const id = session?.data?.user?.id;
  //console.log("iddd", id);
  const router = useRouter();

  const [image, setImage] = useState(advertiser.advertiser?.Image ?? null);
  const [originalImage, setOriginalImage] = useState(
    advertiser.advertiser?.Image ?? null
  );
  //console.log(advertiser);
  const { startUpload } = useUploadThing("imageUploader");
  const inputRef = useRef(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [documentsBool, setDocumentsBool] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProfileCreateMode, setIsProfileCreateMode] = useState(false);
  const [isProfileEditMode, setIsProfileEditMode] = useState(false);
  //console.log(advertiser.advertiser);
  const [formData, setFormData] = useState({
    UserName: advertiser.advertiser.UserId?.UserName || "",
    Email: advertiser.advertiser.UserId?.Email || "",
    Website: advertiser.advertiser.CompanyProfile.Website || "",
    Hotline: advertiser.advertiser.CompanyProfile.Hotline || "",
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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
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

    try {
      //console.log(session?.data?.user?.id);
      if (oldPassword !== "" && newPassword !== "") {
        const changePasswordRes = await fetcher(
          `/users/change-password/${session?.data?.user?.userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ oldPassword, newPassword }),
          }
        );

        if (!changePasswordRes.ok) {
          alert("Failed to change password");
          return;
        }
      }

      // let Image = "";

      // //console.log(`image: ${image}`)
      // if (image) {
      //   const imageUploadResult = await startUpload([image]);
      //   //console.log(`imageUploadResult: ${imageUploadResult}`)
      //   if (!imageUploadResult?.length) {
      //    alert("Failed to upload image");
      //    return;
      //   }
      //   Image = imageUploadResult[0].url;
      // }

      //Image= "https://utfs.io/f/kltUTFpXt5coWbhJnjIbDafoFlMTe8NZKgvpCz36WwXikmsV";

      //console.log(`image: ${JSON.stringify(image)}`);
      //console.log(`session: ${JSON.stringify(session)}`);
      const response = await fetcher(
        `/advertisers/${session?.data?.user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            Image:
              "https://utfs.io/f/kltUTFpXt5coWbhJnjIbDafoFlMTe8NZKgvpCz36WwXikmsV",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        //console.log("Advertiser updated successfully:", result);
        setIsEditMode(false);
        router.refresh();
      } else {
        alert("Error updating advertiser");
        console.error("Error updating advertiser");
      }
    } catch (error) {
      console.error("Failed to update advertiser:", error);
    }
  };

  let num = 0;
  const documentlist = advertiser.advertiser.Document.map((doc) => {
    num++;
    return <iframe className="w-full h-[720px]" src={doc} />;
  });

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

        if (response.ok) {
          const result = await response.json();
          console.log("Profile created successfully:", result);
          setIsProfileCreateMode(false);
          router.refresh();
          const errorData = await response.json();
          console.log(errorData);
          alert(errorData.message || "An error occurred");
        }
      } catch (error) {
        console.error("Failed to create profile:", error);
      }
    } else if (isProfileEditMode) {
      try {
        if (oldPassword !== "" && newPassword !== "") {
          const changePasswordRes = await fetcher(
            `/users/change-password/${session?.data?.user?.userId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ oldPassword, newPassword }),
            }
          );

          if (!changePasswordRes.ok) {
            alert("Failed to change password");
            return;
          }
        }

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

        if (response.ok) {
          const result = await response.json();
          console.log("Profile updated successfully:", result);
          setIsProfileEditMode(false);
          router.refresh();
        } else {
          const errorData = await response.json();
          console.log(errorData);
          alert(errorData.message || "An error occurred");
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    }
  };

  const [theActivities, setTheActivities] = useState([]);
  const [theLoading, setTheLoading] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesRes = await fetcher("/activities");

        if (!activitiesRes?.ok) {
          const activitiesError = await activitiesRes.json();
          console.log(activitiesError);
          setTheActivities([]);
          return;
        }

        const theActivities = await activitiesRes.json();
        console.log("Session User ID:", session?.data?.user?.id);

        const filteredActivities = theActivities.filter(
          (activity) => activity?.AdvertiserId?._id === session?.data?.user?.id
        );
        setTheActivities(filteredActivities);
      } catch (e) {
        console.error("Error fetching activities:", e);
        setTheActivities([]);
      } finally {
        setTheLoading(false);
      }
    };

    if (session?.status === "authenticated") {
      fetchActivities();
    }
  }, [session]);

  let activityList = <li>Loading...</li>;
  if (!theLoading && theActivities.length) {
    activityList = theActivities.map((activity, index) => (
      <li
        key={activity?._id}
        className="border border-slate-500 shadow p-2 rounded-lg w-fit"
      >
        <h3>{activity?.Name}</h3>
      </li>
    ));
  } else if (
    !theLoading &&
    !theActivities.length &&
    session?.status === "authenticated"
  ) {
    activityList = <li>No activities found.</li>;
  }

  return (
    <div className="flex flex-col items-center p-4 my-10">
      <div className="flex flex-col items-center mb-8">
        <img
          src={image}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h1 className="text-2xl font-bold text-purple-600">
          {formData.UserName}
        </h1>
      </div>

      <div className="relative w-full p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-md ">
        <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
          Information
        </h2>

        <Tabs defaultValue="profile">
          <TabsList className="flex mb-6 space-x-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="company">Company Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {isEditMode ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <label>
                    <strong>Name</strong>
                    <input
                      type="text"
                      name="UserName"
                      value={formData.UserName}
                      onChange={handleInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <strong>Email</strong>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <strong>Hotline</strong>
                    <input
                      type="text"
                      name="Hotline"
                      value={formData.Hotline}
                      onChange={handleInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <strong>Website</strong>
                    <input
                      type="text"
                      name="Website"
                      value={formData.Website}
                      onChange={handleInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <strong>Old Password</strong>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <strong>New Password</strong>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                </div>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </form>
            ) : (
              <div className="py-5 space-y-6">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Username:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {formData.UserName || "Not provided"}
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {formData.Email !== null ? formData.Email : "No Email"}
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Hotline:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {formData.Hotline || "Not provided"}
                  </div>
                </div>

                <div>
                  <strong>Website</strong>
                  <h2>{formData.Website ? formData.Website : "No Website"}</h2>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <Network className="w-5 h-5" />
                    <span>Website:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {formData.Website ? formData.Website : "No Website"}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-gray-600 flex items-center space-x-2 mb-2">
                    <FerrisWheel className="w-5 h-5" />
                    <span>Activities:</span>
                  </div>
                  <ul className="flex flex-row gap-2 flex-wrap">
                    {activityList}
                  </ul>
                </div>

                <div className="gap-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setDocumentsBool(!documentsBool);
                    }}
                  >
                    {!documentsBool ? "Show Documents" : "Hide Documents"}
                  </Button>
                  {documentsBool && <ul>{documentlist}</ul>}
                </div>

                <div className="flex flex-row justify-center items-center gap-4 m-auto mt-4">
                  <div className="flex justify-center mt-4 w-1/2">
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                      onClick={handleEditClick}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </div>
                  <div className="flex justify-center mt-4  w-1/2">
                    <Button
                      onClick={() => setRequestOpen(true)}
                      className="bg-red-500 hover:bg-red-600 w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Request Deletion
                    </Button>
                  </div>
                </div>

                <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
                  <DialogContent>
                    <DialogHeader>
                      Are you sure you want to request deletion of your account?
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        disabled={loading}
                        onClick={() => setRequestOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={loading}
                        variant="destructive"
                        onClick={async () => {
                          setLoading(true);
                          await fetcher(
                            `/users/request-deletion/${session?.data.user?.userId}`,
                            {
                              method: "POST",
                            }
                          );
                          await signOut({ redirect: true, callbackUrl: "/" });
                          setLoading(false);
                        }}
                      >
                        Request Deletion
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>

          <TabsContent value="company">
            {(formData?.CompanyProfile && isProfileEditMode) ||
            (!formData?.CompanyProfile && isProfileCreateMode) ? (
              <form onSubmit={handleProfileSubmit}>
                <div>
                  <label>
                    <strong>Name</strong>
                    <input
                      type="text"
                      name="Name"
                      value={profileformData.Name}
                      onChange={handleProfileInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                  <label>
                    <strong>Industry</strong>
                    <input
                      type="text"
                      name="Industry"
                      value={profileformData.Industry}
                      onChange={handleProfileInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                  <label>
                    <strong>Founded Date</strong>
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
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                      required
                    />
                  </label>
                  <label>
                    <strong>Headquarters</strong>
                    <input
                      type="text"
                      name="Headquarters"
                      value={profileformData.Headquarters}
                      onChange={handleProfileInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                  <label>
                    <strong>Description</strong>
                    <input
                      type="text"
                      name="Description"
                      value={profileformData.Description}
                      onChange={handleProfileInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                  <label>
                    <strong>Website</strong>
                    <input
                      type="text"
                      name="Website"
                      value={profileformData.Website}
                      onChange={handleProfileInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                  <label>
                    <strong>Email</strong>
                    <input
                      type="text"
                      name="Email"
                      value={profileformData.Email}
                      onChange={handleProfileInputChange}
                      className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    />
                  </label>
                </div>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </form>
            ) : (
              <div className="py-5 space-y-6">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Company Name:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {profileformData.Name || "Not provided"}
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <Factory className="w-5 h-5" />
                    <span>Industry:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {profileformData.Industry || "Not provided"}
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <CalendarFold className="w-5 h-5" />
                    <span>Founded Date:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {profileformData.FoundedDate.split("T")[0] ||
                      "Not provided"}
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <House className="w-5 h-5" />
                    <span>Headquarters:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {profileformData.Headquarters
                      ? profileformData.Headquarters
                      : "No Headquarters"}
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Description:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {profileformData.Description
                      ? profileformData.Description
                      : "No Description"}
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <Network className="w-5 h-5" />
                    <span>Website:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {profileformData.Website
                      ? profileformData.Website
                      : "No Website"}
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="font-semibold text-gray-600 flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email:</span>
                  </div>
                  <div className="text-base text-gray-900">
                    {profileformData.Email ? profileformData.Email : "No Email"}
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handleEditCompanyProfileClick}
                    className="bg-purple-600 hover:bg-purple-700 w-full"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* {isEditMode ? (
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
                <strong>Image:</strong>
                {image ? (
                  <div className="relative w-16 h-16 cursor-pointer rounded-full overflow-hidden">
                    <Image
                      width={64}
                      height={64}
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt="advertiser image"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                      name="Image"
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                      }}
                      className="hidden w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center cursor-pointer bg-gray-300 w-16 h-16 rounded-full overflow-hidden">
                    <UploadIcon size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                      name="Image"
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                      }}
                      className="hidden w-full h-full"
                    />
                  </div>
                )}
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
                <strong>Old Password:</strong>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="border p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                <strong>New Password:</strong>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
          ""
        )} */}
      </div>
    </div>
  );
}
