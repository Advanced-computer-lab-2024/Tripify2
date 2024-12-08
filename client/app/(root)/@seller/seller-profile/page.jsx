"use client";
import { useState, useEffect, useRef } from "react";
import { Edit, User, Mail, FileText, Loader2, CloudUpload } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing-hook";
import { fetcher } from "@/lib/fetch-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function UserProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const { startUpload } = useUploadThing('imageUploader');
  const inputRef = useRef(null);

  // State Management
  const [profile, setProfile] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Description: "",
  });

  // Fetch user data
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
        setImage(sellerData.Seller.Image ?? null);
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

      const isUsernameTaken = existingUsers.some(
        (user) => user.UserName === formData.UserName && user._id !== profile._id
      );
      const isEmailTaken = existingUsers.some(
        (user) => user.Email === formData.Email && user._id !== profile._id
      );

      if (isUsernameTaken) {
        setError("Username is already taken.");
        return;
      }

      if (isEmailTaken) {
        setError("Email is already taken.");
        return;
      }

      let Image = '';

      if (oldPassword !== "" && newPassword !== "") {
        const changePasswordRes = await fetcher(
          `/users/change-password/${session?.user?.userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ oldPassword, newPassword }),
          }
        );

        if (!changePasswordRes.ok) {
          throw new Error("Failed to update password");
        }

        setOldPassword("");
        setNewPassword("");
      }

      if (image) {
        const imageUploadResult = await startUpload([image]);
        if (imageUploadResult?.length) {
          Image = imageUploadResult[0].url;
        } else Image = image;
      }

      await fetcher(`/sellers/${sellerProfile?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Description: formData.Description,
          UserName: formData.UserName,
          Email: formData.Email,
          Image,
        }),
      });

      setIsEditing(false);
      setSuccess(true);
      router.refresh();

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

  console.log(image)

  return (
    <div className="flex flex-col items-center p-4 my-10">
      {/* User Header */}
      <div className="flex items-center justify-center w-full mb-4">
        <div className="relative w-16 h-16 overflow-hidden rounded-full">
          {image ? (
            <Image
              width={64}
              height={64}
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt="profile image"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-300">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex flex-col p-4 justify-left items-left">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold text-purple-600">{profile.UserName}</h1>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="relative w-full p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-md">
        <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
          Information
        </h2>

        {isEditing ? (
          <div className="py-5 space-y-6">
            {/* Image Upload */}
            <div className="block w-full">
              <span className="block mb-2 font-medium text-gray-700">Profile Image</span>
              <div className="relative w-40 h-40 overflow-hidden rounded-lg cursor-pointer" onClick={() => inputRef.current.click()}>
                {image ? (
                  <Image
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt="Profile"
                    className="object-cover"
                    fill
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <CloudUpload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            {/* Username */}
            <div className="block w-full">
              <span className="block font-medium text-gray-700">Username</span>
              <Input
                name="UserName"
                value={formData.UserName}
                onChange={handleChange}
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Email */}
            <div className="block w-full">
              <span className="block font-medium text-gray-700">Email</span>
              <Input
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div className="block w-full">
              <span className="block font-medium text-gray-700">Description</span>
              <Textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* <div className="block w-full">
              <span className="block font-medium text-gray-700">Old Password</span>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div className="block w-full">
              <span className="block font-medium text-gray-700">New Password</span>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div> */}

            {error && (
              <div className="text-center text-red-500">
                {error}
              </div>
            )}

            {success && (
              <div className="text-center text-green-500">
                Profile updated successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setRequestOpen(true)}
                disabled={loading}
              >
                Request Deletion
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="py-5 space-y-6">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex items-center space-x-2 font-semibold text-gray-600">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>Username:</span>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {profile.UserName || 'Not provided'}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex items-center space-x-2 font-semibold text-gray-600">
                  <Mail className="w-5 h-5 text-green-500" />
                  <span>Email:</span>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {profile.Email || 'Not provided'}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex items-center space-x-2 font-semibold text-gray-600">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span>Description:</span>
                </div>
                <div className="text-base italic text-gray-800">
                  {sellerProfile?.Description || 'No description provided'}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Account Deletion Dialog */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>Are you sure you want to request deletion of your account?</DialogHeader>
          <DialogFooter>
            <Button disabled={loading} onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={async () => {
                setLoading(true);
                await fetcher(`/users/request-deletion/${session?.user?.userId}`, {
                  method: 'POST'
                });
                await signOut({ redirect: true, callbackUrl: '/' });
                setLoading(false);
              }}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Request Deletion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}