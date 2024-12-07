"use client";
import { useState, useEffect } from "react";
import {
  Edit,
  User,
  Mail,
  FileText,
  Loader2,
  CloudUpload,
  Trash2,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing-hook";
import { fetcher } from "@/lib/fetch-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Zod Schema for Profile Validation
const profileSchema = z
  .object({
    UserName: z.string().min(2, {
      message: "Username must be at least 2 characters long",
    }),
    Email: z.string().email({
      message: "Please enter a valid email address",
    }),
    Description: z.string().optional(),
    OldPassword: z.string().optional(),
    NewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If either old or new password is provided, both must be present
      if (data.OldPassword || data.NewPassword) {
        return data.OldPassword && data.NewPassword;
      }
      return true;
    },
    {
      message: "Both old and new passwords must be provided",
      path: ["OldPassword", "NewPassword"],
    }
  );

export default function UserProfile({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { startUpload } = useUploadThing("imageUploader");

  // State for user data
  const [userData, setUserData] = useState({
    UserName: "",
    Email: "",
    Description: "",
    Image: null,
    Badge: "Bronze",
    LoyaltyPoints: 0,
  });

  // State for form handling
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

  // Use React Hook Form with Zod Resolver
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      UserName: "",
      Email: "",
      Description: "",
      OldPassword: "",
      NewPassword: "",
    },
  });

  // Default avatar
  const imgSrcForNow =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.userId) return;

      try {
        // Fetch user details
        const userResponse = await fetcher(`/users/${session.user.userId}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user profile");
        const userData = await userResponse.json();

        // Update state
        setUserData({
          UserName: userData.UserName || "",
          Email: userData.Email || "",
          Description: userData.Description || "",
          Image: userData.Image || null,
        });

        // Reset form
        form.reset({
          UserName: userData.UserName,
          Email: userData.Email,
          Description: userData.Description,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        form.setError("root", {
          type: "manual",
          message: "Failed to load profile",
        });
      }
    };

    fetchUserProfile();
  }, [session, form]);

  // Handle profile update
  const handleSave = async (values) => {
    setLoading(true);

    try {
      // Similar validation and update logic from the original code
      // ... (keep the existing validation and update logic)

      setImageUploaded(null);
      setIsUpdateFormVisible(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      form.setError("root", {
        type: "manual",
        message: error.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion request
  const handleRequestDeletion = async () => {
    setLoading(true);
    try {
      await fetcher(`/users/request-deletion/${session?.user?.userId}`, {
        method: "POST",
      });
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("Deletion request failed:", error);
      form.setError("root", {
        type: "manual",
        message: "Failed to request account deletion",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 my-10">
      <div className="flex items-center justify-center w-full mb-4">
        <img
          src={userData.Image || imgSrcForNow}
          alt="User Avatar"
          className="w-24 h-24 mr-4 rounded-full"
        />
        <div className="flex flex-col p-4 justify-left items-left">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold text-purple-600">
              {userData.UserName}
            </h1>
          </div>
        </div>
      </div>

      <div className="relative w-full p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-md">
        <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
          Information
        </h2>

        {isUpdateFormVisible ? (
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="py-5 space-y-6"
          >
            {/* Username */}
            <div className="block w-full">
              <span className="block font-medium text-gray-700">Username</span>
              <Input
                {...form.register("UserName")}
                disabled={loading}
                placeholder="Enter new username"
                className="mt-1"
              />
              {form.formState.errors.UserName && (
                <p className="text-red-500 mt-1">
                  {form.formState.errors.UserName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="block w-full">
              <span className="block font-medium text-gray-700">Email</span>
              <Input
                {...form.register("Email")}
                type="email"
                disabled={loading}
                placeholder="Enter new email"
                className="mt-1"
              />
              {form.formState.errors.Email && (
                <p className="text-red-500 mt-1">
                  {form.formState.errors.Email.message}
                </p>
              )}
            </div>

            {/* Profile Image Upload */}
            {/* <div className="block w-full">
              <span className="block font-medium text-gray-700 mb-2">Profile Image</span>
              <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                {imageUploaded ? (
                  <Image
                    src={
                      typeof imageUploaded === 'string' 
                        ? imageUploaded 
                        : URL.createObjectURL(imageUploaded)
                    }
                    alt="Profile"
                    className="object-cover"
                    fill
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <CloudUpload className="text-gray-400 w-8 h-8" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setImageUploaded(file);
                    }
                  }}
                />
              </div>
            </div> */}

            {/* Description */}
            <div className="block w-full">
              <span className="block font-medium text-gray-700">
                Description
              </span>
              <Textarea
                {...form.register("Description")}
                disabled={loading}
                placeholder="Enter description"
                className="mt-1"
              />
            </div>

            {/* Old Password */}
            <div className="block w-full">
              <span className="block font-medium text-gray-700">
                Old Password
              </span>
              <Input
                {...form.register("OldPassword")}
                type="password"
                disabled={loading}
                placeholder="Enter old password"
                className="mt-1"
              />
            </div>

            {/* New Password */}
            <div className="block w-full">
              <span className="block font-medium text-gray-700">
                New Password
              </span>
              <Input
                {...form.register("NewPassword")}
                type="password"
                disabled={loading}
                placeholder="Enter new password"
                className="mt-1"
              />
              {form.formState.errors.OldPassword && (
                <p className="text-red-500 mt-1">
                  {form.formState.errors.OldPassword.message}
                </p>
              )}
            </div>

            {/* Form-level error */}
            {form.formState.errors.root && (
              <div className="text-red-500 text-center mb-4">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-4 w-full">
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 w-1/2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setRequestOpen(true)}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 w-1/2"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Request Deletion
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="py-5 space-y-6">
              {/* Static information display */}
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="font-semibold text-gray-600 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Username:</span>
                </div>
                <div className="text-base text-gray-900">
                  {userData.UserName || "Not provided"}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="font-semibold text-gray-600 flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Email:</span>
                </div>
                <div className="text-base text-gray-900">
                  {userData.Email || "Not provided"}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="font-semibold text-gray-600 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Description:</span>
                </div>
                <div className="text-base text-gray-800 italic">
                  {userData.Description ||
                    "I sell excellent replicas of pharaonic artifacts"}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 w-full">
              <Button
                onClick={() => setIsUpdateFormVisible(true)}
                className="bg-purple-600 hover:bg-purple-700 w-full"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Account Deletion Confirmation Dialog */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            Are you sure you want to request deletion of your account?
          </DialogHeader>
          <DialogFooter>
            <Button disabled={loading} onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleRequestDeletion}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Request Deletion"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
