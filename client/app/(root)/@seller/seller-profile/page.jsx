"use client";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/fetch-client";
import { signOut, useSession } from "next-auth/react";
import { useUploadThing } from "@/lib/uploadthing-hook";
import Image from "next/image";
import { Edit, CloudUpload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogHeader, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User, Mail, FileText } from 'lucide-react';

// Zod Schema for Profile Validation
const profileSchema = z.object({
  UserName: z.string().min(2, {
    message: "Username must be at least 2 characters long",
  }),
  Email: z.string().email({
    message: "Please enter a valid email address",
  }),
  Description: z.string().optional(),
  OldPassword: z.string().optional(),
  NewPassword: z.string().optional(),
}).refine(
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

export default function UserProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const { startUpload } = useUploadThing('imageUploader');

  // State for user data
  const [userData, setUserData] = useState({
    UserName: "",
    Email: "",
    Description: "",
    Image: null
  });

  // State for UI and form handling
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

  // Fetch user data on component mount and session change
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.userId) return;

      try {
        // Fetch user details
        const userResponse = await fetcher(`/users/${session.user.userId}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user profile");
        const userData = await userResponse.json();

        // Fetch seller details
        const sellerResponse = await fetcher(`/sellers/user/${session.user.userId}`);
        if (!sellerResponse.ok) throw new Error("Failed to fetch seller profile");
        const sellerData = await sellerResponse.json();

        // Update state with fetched data
        setUserData({
          UserName: userData.UserName || "",
          Email: userData.Email || "",
          Description: sellerData.Seller?.Description || "",
          Image: sellerData.Seller?.Image || null
        });

        // Update form values
        form.reset({
          UserName: "",
          Email:  "",
          Description:  "",
          OldPassword: "",
          NewPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        form.setError("root", { 
          type: "manual", 
          message: "Failed to load profile" 
        });
      }
    };

    fetchUserProfile();
  }, [session, form]);

  // Handle profile update
  const handleSave = async (values) => {
    setLoading(true);

    try {
      // Check for username/email uniqueness
      const usersResponse = await fetcher(`/users`);
      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }
      const existingUsers = await usersResponse.json();

      const isUsernameTaken = existingUsers.some(
        user => user.UserName === values.UserName && user._id !== session?.user?.userId
      );
      const isEmailTaken = existingUsers.some(
        user => user.Email === values.Email && user._id !== session?.user?.userId
      );

      if (isUsernameTaken) {
        form.setError("UserName", { 
          type: "manual", 
          message: "Username is already taken" 
        });
        setLoading(false);
        return;
      }

      if (isEmailTaken) {
        form.setError("Email", { 
          type: "manual", 
          message: "Email is already taken" 
        });
        setLoading(false);
        return;
      }

      // Handle image upload
      let imageUrl = imageUploaded;
      if (imageUploaded && typeof imageUploaded !== 'string') {
        const uploadedImage = await startUpload([imageUploaded]);
        if (uploadedImage?.length) {
          imageUrl = uploadedImage[0].url;
        }
      }

      // Handle password change if both old and new passwords are provided
      if (values.OldPassword && values.NewPassword) {
        await fetcher(`/users/change-password/${session?.user?.userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: values.OldPassword,
            newPassword: values.NewPassword,
          }),
        });
      }

      // Update seller profile
      await fetcher(`/sellers/${session?.user?.sellerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Description: values.Description,
          UserName: values.UserName,
          Email: values.Email,
          Image: imageUrl,
        }),
      });

      // Update local state
      setUserData(prev => ({
        ...prev,
        UserName: values.UserName,
        Email: values.Email,
        Description: values.Description,
        Image: imageUrl
      }));

      // Reset form and UI
      setImageUploaded(null);
      setIsUpdateFormVisible(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      form.setError("root", { 
        type: "manual", 
        message: error.message || "Failed to update profile" 
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
        method: 'POST'
      });
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error("Deletion request failed:", error);
      form.setError("root", { 
        type: "manual", 
        message: "Failed to request account deletion" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      
      {/* User Data Display Section */}
      <div className="mb-8 text-center relative">
        
        {userData.Image && (
          <div className="mx-auto w-40 h-40 mb-4">
            <Image 
              src={userData.Image} 
              alt="Profile" 
              width={160} 
              height={160} 
              className="rounded-full object-cover"
            />
          </div>
        )}
       <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gray-100 pb-4">
        <CardTitle className="flex items-center space-x-3">
          <User className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">User Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          <div className="font-semibold text-gray-600 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-500" />
            <span>Username:</span>
          </div>
          <div className="text-lg font-medium text-gray-900">
            {userData.UserName || 'Not provided'}
          </div>
        </div>
        
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          <div className="font-semibold text-gray-600 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-green-500" />
            <span>Email:</span>
          </div>
          <div className="text-lg font-medium text-gray-900">
            {userData.Email || 'Not provided'}
          </div>
        </div>
        
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          <div className="font-semibold text-gray-600 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-500" />
            <span>Description:</span>
          </div>
          <div className="text-base text-gray-800 italic">
            {userData.Description || 'No description available'}
          </div>
        </div>
      </CardContent>
    </Card>
        
        {/* Button to show update form */}
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setIsUpdateFormVisible(!isUpdateFormVisible)}
        >
          <Edit className="mr-2 h-4 w-4" /> Update Profile
        </Button>
      </div>

      {/* Conditional Profile Update Form */}
      {isUpdateFormVisible && (
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <div>
            <label className="block mb-2">Username</label>
            <Input
              {...form.register("UserName")}
              disabled={loading}
              placeholder="Enter new username"
            />
            {form.formState.errors.UserName && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.UserName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <Input
              {...form.register("Email")}
              type="email"
              disabled={loading}
              placeholder="Enter new email"
            />
            {form.formState.errors.Email && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.Email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">Profile Image</label>
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
                  width={160}
                  height={160}
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
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <Textarea
              {...form.register("Description")}
              disabled={loading}
              placeholder="Enter new description"
            />
          </div>

          <div>
            <label className="block mb-2">Old Password (optional)</label>
            <Input
              {...form.register("OldPassword")}
              type="password"
              disabled={loading}
              placeholder="Enter old password"
            />
          </div>

          <div>
            <label className="block mb-2">New Password (optional)</label>
            <Input
              {...form.register("NewPassword")}
              type="password"
              disabled={loading}
              placeholder="Enter new password"
            />
            {form.formState.errors.OldPassword && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.OldPassword.message}
              </p>
            )}
          </div>

          {form.formState.errors.root && (
            <div className="text-red-500 text-center mb-4">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="flex justify-between gap-4">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setRequestOpen(true)}
              disabled={loading}
            >
              Request Deletion
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      )}

      {/* Account Deletion Confirmation Dialog */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>Are you sure you want to request deletion of your account?</DialogHeader>
          <DialogFooter>
            <Button disabled={loading} onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={loading} 
              variant='destructive' 
              onClick={handleRequestDeletion}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Request Deletion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}