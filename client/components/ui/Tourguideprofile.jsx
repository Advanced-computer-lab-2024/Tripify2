"use client";
import React, { useRef, useState, useEffect } from "react";
import { Edit, User, Mail, FileText, Loader2, CloudUpload, UploadIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing-hook";
import { fetcher } from "@/lib/fetch-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function Tourguideprofile({ tourguide, tourguideid, role }) {
  const router = useRouter();
  const session = useSession();
  const inputRef = useRef(null);

  // State Management
  const [image, setImage] = useState(tourguide?.Image ?? null);
  const { startUpload } = useUploadThing('imageUploader');
  const [requestOpen, setRequestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentsBool, setDocumentsBool] = useState(false);
  const [pagestate, setPagestate] = useState("Read");
  const [allitineraries, setItineraries] = useState([]);

  const [formData, setFormData] = useState({
    MobileNumber: tourguide.MobileNumber,
    YearsOfExperience: tourguide.YearsOfExperience,
    PreviousWork: tourguide.PreviousWork,
    Accepted: tourguide.Accepted,
    Email: tourguide.UserId.Email,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Document handling
  const documentlist = tourguide.Documents.map((doc, index) => (
    <iframe key={index} className='w-full h-[720px]' src={doc} />
  ));

  // Fetch itineraries
  useEffect(() => {
    const fetchitinerary = async () => {
      try {
        const response = await fetcher(`/itineraries`);
        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        console.error("Failed to fetch itineraries:", error);
      }
    };
    fetchitinerary();
  }, []);

  let itinerarylist = <li>loading...</li>;
  if (allitineraries.length !== 0) {
    itinerarylist = tourguide.Itineraries.map((itinerary, index) => (
      <li key={index} className="p-2 border rounded-lg shadow border-slate-500 w-fit">
        <h3>{itinerary.Name}</h3>
      </li>
    ));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (oldPassword !== "" && newPassword !== "") {
        const changePasswordRes = await fetcher(`/users/change-password/${session?.data?.user?.userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        });

        if (!changePasswordRes.ok) {
          alert("Failed to change password");
          return;
        }

        alert("Password changed successfully");
      }

      let Image = '';

      if (image) {
        const imageUploadResult = await startUpload([image]);
        if (!imageUploadResult.length) {
          alert("Failed to upload image");
          return;
        }
        Image = imageUploadResult[0].url;
      }

      const response = await fetcher(`/tourguides/${tourguideid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, Image }),
      });

      if (response.ok) {
        setPagestate("Read");
        alert("Successfully updated a tour guide");
        router.refresh();
      } else {
        console.error("Error updating tour guide");
      }
    } catch (error) {
      console.error("Failed to update a tour guide:", error);
    }
  };

  const imgSrcForNow = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  if (!tourguide.Accepted) {
    return <h1 className="mt-8 text-xl text-center">You are NOT accepted by the system</h1>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      {pagestate === "Read" ? (
        <div className="flex flex-col w-2/3 gap-4">
          <div className="flex items-center justify-center w-full mb-4">
            <img
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt="User Avatar"
              className="object-cover w-24 h-24 mr-4 rounded-full"
            />
            <div className="flex flex-col p-4 justify-left items-left">
              <div className="flex items-center gap-1">
                <h1 className="text-2xl font-bold text-purple-600">{tourguide.UserId.UserName}</h1>
              </div>
            </div>
          </div>

          <div className="relative w-full p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-md">
            <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
              Information
            </h2>
            <div className="flex flex-col gap-4 p-4">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex items-center space-x-2 font-semibold text-gray-600">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>Mobile Number:</span>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {tourguide.MobileNumber}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex items-center space-x-2 font-semibold text-gray-600">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span>Years of Experience:</span>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {tourguide.YearsOfExperience || "No experience"}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex items-center space-x-2 font-semibold text-gray-600">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span>Previous Work:</span>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {tourguide.PreviousWork || "No previous work"}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="flex items-center space-x-2 font-semibold text-gray-600">
                  <Mail className="w-5 h-5 text-green-500" />
                  <span>Email:</span>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {tourguide.UserId.Email}
                </div>
              </div>

              <div>
                <strong className="block mb-2">Itineraries:</strong>
                <ul className="flex flex-row flex-wrap gap-2">{itinerarylist}</ul>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  className="w-36"
                  onClick={() => setDocumentsBool(!documentsBool)}
                >
                  {!documentsBool ? "Show Documents" : "Hide Documents"}
                </Button>
                {documentsBool && <div className="space-y-4">{documentlist}</div>}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setPagestate("Edit")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setRequestOpen(true)}
                >
                  Request Deletion
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-2/4">
          <h1 className="mb-6 text-2xl font-bold">Edit Profile</h1>
          <div className="relative w-full p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-md">
            <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
              Information
            </h2>

            <div className="p-4 space-y-6">
              <div>
                <label className="block mb-2">
                  <strong>Profile Image:</strong>
                </label>
                {image ? (
                  <div className='relative w-16 h-16 overflow-hidden rounded-full cursor-pointer' onClick={() => inputRef.current.click()}>
                    <Image width={64} height={64} src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="tourguide image" />
                    <input
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className='relative flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-300 rounded-full cursor-pointer' onClick={() => inputRef.current.click()}>
                    <UploadIcon size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {Object.entries({
                  "Mobile Number": { name: "MobileNumber", type: "number" },
                  "Years of Experience": { name: "YearsOfExperience", type: "number" },
                  "Previous Work": { name: "PreviousWork", type: "text" },
                  "Email": { name: "Email", type: "email" }
                }).map(([label, { name, type }]) => (
                  <div key={name}>
                    <label className="block mb-1">
                      <strong>{label}:</strong>
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder={`Current: ${tourguide[name] || tourguide.UserId[name]}`}
                      required={name !== "PreviousWork"}
                    />
                  </div>
                ))}

                {/* <div>
                  <label className="block mb-1">
                    <strong>Old Password:</strong>
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    <strong>New Password:</strong>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div> */}

                {role === "Admin" && (
                  <div>
                    <label className="block mb-1">
                      <strong>Accepted:</strong>
                    </label>
                    <input
                      type="file"
                      name="Accepted"
                      value={formData.Accepted}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPagestate("Read")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}

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
                await fetcher(`/users/request-deletion/${session?.data?.user?.userId}`, {
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

export default Tourguideprofile;