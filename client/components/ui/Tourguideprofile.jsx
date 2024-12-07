"use client";
import React, { useRef } from "react";
import { fetcher } from "@/lib/fetch-client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useUploadThing } from "@/lib/uploadthing-hook";
import Image from "next/image";
import {
  UploadIcon,
  BriefcaseBusiness,
  Phone,
  ShieldHalf,
  Mail,
  User,
  TramFront,
  Edit,
  Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

function Tourguideprofile({ tourguide, tourguideid, role }) {
  //console.log(tourguide);
  const router = useRouter();
  const session = useSession();

  const [image, setImage] = useState(tourguide?.Image ?? null);
  const { startUpload } = useUploadThing("imageUploader");
  const inputRef = useRef(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentsBool, setDocumentsBool] = useState(false);

  const [resultTest, setResultTest] = useState([]);
  let num = 0;
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
  //   console.log(formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const documentlist = tourguide.Documents.map((doc) => {
    num++;
    return <iframe className="w-full h-[720px]" src={doc} />;
  });

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

  let itinerarylist = <li>Loading...</li>;
  if (allitineraries.length !== 0) {
    //let result = [];
    // tourguide.Itineraries.map((itinerary) => {
    //   const found = allitineraries.find((one) => one._id == itinerary);
    //   //const found = allitineraries.filter((one) => one._id === itinerary);
    //   //   result.push(found);
    //   //   setResultTest((prevResult) => [...prevResult, found]);
    //   console.log("=,-=-=-=-==-==-=-=-=");
    //   console.log(found);
    //   console.log("=-=-=-=-==-==-=-=-=");
    // });
    // itinerarylist = result.map((one) => (
    //   <li>
    //     <h3>Name:{one.Name}</h3>
    //     <h3>StartDate:{one.StartDate}</h3>
    //     <h3>EndDate:{one.EndDate}</h3>
    //   </li>
    // ));
    // console.log("---------------------------");
    // console.log(tourguide.Itineraries);
    // console.log("---------------------------");

    itinerarylist = tourguide.Itineraries.map((itinerary) => {
      //   console.log(itinerary);
      return (
        <li className="border border-slate-500 shadow p-2 rounded-lg w-fit">
          <h3>{itinerary.Name}</h3>
          {/* <h3>StartDate:{itinerary.StartDate}</h3>
            <h3>EndDate:{itinerary.EndDate}</h3> */}
        </li>
      );
    });
    // itinerarylist = tourguide.Itineraries.map(itinerary => {

    // });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
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

        alert("Password changed successfully");
      }

      let Image = "";

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
        // Redirect back to the activities list page
      } else {
        console.log("PROBLEM");
        console.error("Error updating tour guide");
      }
    } catch (error) {
      console.error("Failed to update a tour guide:", error);
    }
  };

  const imgSrcForNow =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  return (
    <div className="flex flex-col justify-center items-center p-6 gap-4">
      {tourguide.Accepted && allitineraries && pagestate == "Read" ? (
        <div className=" flex flex-col gap-4 w-full">
          <div className="flex items-center justify-center w-full mb-4">
            <img
              src={imgSrcForNow}
              alt="User Avatar"
              className="w-24 h-24 mr-4 rounded-full"
            />
            <div className="flex flex-col p-4 justify-left items-left">
              <div className="flex items-center gap-1">
                <h1 className="text-2xl font-bold text-purple-600">
                  {tourguide.UserId.UserName}
                </h1>
              </div>
            </div>
          </div>

          <div className="relative w-full p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-md">
            <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
              Information
            </h2>
            <div className="py-5 space-y-6">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="font-semibold text-gray-600 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Username:</span>
                </div>
                <div className="text-base text-gray-900">
                  {tourguide.UserId.UserName || "Not provided"}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="font-semibold text-gray-600 flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Mobile Number:</span>
                </div>
                <div className="text-base text-gray-900">
                  {tourguide.MobileNumber || "Not provided"}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="font-semibold text-gray-600 flex items-center space-x-2">
                  <ShieldHalf className="w-5 h-5" />
                  <span>Years of Experience:</span>
                </div>
                <div className="text-base text-gray-900">
                  {tourguide.YearsOfExperience !== 0
                    ? tourguide.YearsOfExperience
                    : "Not provided"}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="font-semibold text-gray-600 flex items-center space-x-2">
                  <BriefcaseBusiness className="w-5 h-5" />
                  <span>Previous Work:</span>
                </div>
                <div className="text-base text-gray-900">
                  {tourguide.PreviousWork !== null
                    ? tourguide.PreviousWork
                    : "No previous work"}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="font-semibold text-gray-600 flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Email:</span>
                </div>
                <div className="text-base text-gray-900">
                  {tourguide.UserId.Email !== null
                    ? tourguide.UserId.Email
                    : "No Email"}
                </div>
              </div>

              {/* <div>
                  <strong>Activities</strong>
                  <ul className="flex flex-row gap-2 flex-wrap">
                    {activityList}
                  </ul>
                </div> */}
              <div>
                <div className="font-semibold text-gray-600 flex items-center space-x-2 mb-2">
                  <TramFront className="w-5 h-5" />
                  <span>Itineraries:</span>
                </div>
                <ul className="flex flex-row gap-2 flex-wrap">{itinerarylist}</ul>
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
                    onClick={() => setPagestate("Edit")}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
                <div className="flex justify-center mt-4 w-1/2">
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
          </div>
        </div>
      ) : tourguide.Accepted && pagestate == "Edit" ? (
        <form onSubmit={handleSubmit} className="w-full">
          <h1 className="text-2xl">
            <strong>Edit Profile</strong>
          </h1>
          <div className="relative w-full p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-md">
            <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
              Information
            </h2>
            <div className="mt-4">
              <label>
                <strong>New Mobile Number</strong>
                <input
                  type="number"
                  name="MobileNumber"
                  value={formData.MobileNumber}
                  onChange={handleInputChange}
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                  placeholder={`old: ${tourguide.MobileNumber}`}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                <strong>New Years of Experience</strong>
                <input
                  type="number"
                  name="YearsOfExperience"
                  value={formData.YearsOfExperience}
                  onChange={handleInputChange}
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                  placeholder={`old: ${tourguide.YearsOfExperience}`}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                <strong>New Previous Work: (If any) </strong>
                <input
                  type="text"
                  name="PreviousWork"
                  value={formData.PreviousWork}
                  onChange={handleInputChange}
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                  placeholder={`old: ${tourguide.PreviousWork}`}
                />
              </label>
            </div>
            <div>
              <label>
                <strong>New Email</strong>
                <input
                  type="text"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                  placeholder={`old: ${tourguide.UserId.Email}`}
                />
              </label>
            </div>
            <div>
              <label>
                <strong>Old Password</strong>
                <input
                  type="password"
                  name="OldPassword"
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
                  name="NewPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                />
              </label>
            </div>
            {role == "Admin" && (
              <div>
                <label>
                  <strong>Accepted:</strong>
                  <input
                    type="file"
                    name="Accepted"
                    value={formData.Accepted}
                    onChange={handleInputChange}
                    className="border border-slate-300 rounded-lg p-2 w-full mb-4"
                    required
                  />
                </label>
              </div>
            )}
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 w-full">
              <Edit className="mr-2 h-4 w-4" />Edit
            </Button>
          </div>
        </form>
      ) : (
        <h1>You are NOT accepted by the system</h1>
      )}
    </div>
  );
}

export default Tourguideprofile;
