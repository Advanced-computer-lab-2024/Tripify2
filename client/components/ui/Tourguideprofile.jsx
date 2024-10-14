"use client";
import React, { useRef } from "react";
import { fetcher } from "@/lib/fetch-client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useUploadThing } from "@/lib/uploadthing-hook";
import Image from "next/image";
import { UploadIcon } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Button } from "./button";

function Tourguideprofile({ tourguide, tourguideid, role }) {
  console.log(tourguide)
  const router = useRouter();
  const session = useSession()

  const [image, setImage] = useState(tourguide?.Image ?? null)
  const { startUpload } = useUploadThing('imageUploader')
  const inputRef = useRef(null)
  const [requestOpen, setRequestOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
    return (
      <li>
        {num}.{doc}
      </li>
    );
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

  let itinerarylist = <li>loading...</li>;
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
        <li>
          <h3>Name: {itinerary.Name}</h3>
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
      if(oldPassword !== "" && newPassword !== "") {
        const changePasswordRes = await fetcher(`/users/change-password/${session?.data?.user?.userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        })

        if (!changePasswordRes.ok) {
          alert("Failed to change password")
          return
        }

        alert("Password changed successfully")
      }

      let Image = ''

      if(image) {
        const imageUploadResult = await startUpload([image])
        if(!imageUploadResult.length) {
          alert("Failed to upload image")
          return
        }
        Image = imageUploadResult[0].url
      }

      const response = await fetcher(`/tourguides/${tourguideid}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData, Image}),
      });

      if (response.ok) {
        setPagestate("Read");
        alert("Successfully updated a tour guide");
        router.refresh()
        // Redirect back to the activities list page
      } else {
        console.log("PROBLEM");
        console.error("Error updating tour guide");
      }
    } catch (error) {
      console.error("Failed to update a tour guide:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6 gap-4">
      {tourguide.Accepted && allitineraries && pagestate == "Read" ? (
        <div className="border border-black rounded-md p-4 flex flex-col gap-4 min-w-96">
          <h1 className="text-2xl">
            <strong>My Profile</strong>
          </h1>
          <div>
            <strong>MobileNumber:</strong>
            <h2>{tourguide.MobileNumber}</h2>
          </div>

          <hr />
          <div>
            <strong>YearsOfExperience:</strong>
            <h2>
              {tourguide.YearsOfExperience !== 0
                ? tourguide.YearsOfExperience
                : "No experience"}
            </h2>
          </div>
          <hr />
          <div>
            <strong>PreviousWork:</strong>
            <h2>
              {tourguide.PreviousWork !== null
                ? tourguide.PreviousWork
                : "No previous work"}
            </h2>
          </div>

          <hr />
          <div>
            <strong>Documents:</strong>
            <ul>{documentlist}</ul>
          </div>
          <hr />
          <div>
            <strong>Email:</strong>
            <h2>
              {tourguide.UserId.Email !== null
                ? tourguide.UserId.Email
                : "No previous work"}
            </h2>
          </div>
          <div>
            <strong>Itineraries:</strong>
            <ul className="flex flex-col gap-2">{itinerarylist}</ul>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setPagestate("Edit")}
          >
            edit profile
          </button>
          <button
            onClick={() => setRequestOpen(true)}
            className="bg-red-500 text-white px-4 rounded py-2"
          >
            Request Deletion
          </button>

          <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
            <DialogContent>
              <DialogHeader>Are you sure you want to request deletion of your account?</DialogHeader>
              <DialogFooter>
                <Button disabled={loading} onClick={() => setRequestOpen(false)}>Cancel</Button>
                <Button disabled={loading} variant='destructive' onClick={async () => {
                  setLoading(true)
                  await fetcher(`/users/request-deletion/${session?.data.user?.userId}`, {
                    method: 'POST'
                  })
                  await signOut({ redirect: true, callbackUrl: '/' })
                  setLoading(false)
                }}>Request Deletion</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : tourguide.Accepted && pagestate == "Edit" ? (
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl">
            <strong>Edit Profile</strong>
          </h1>
          <div>
            <label>
              <strong>Image:</strong>
              {image ? (
                <div className='relative w-16 h-16 cursor-pointer rounded-full overflow-hidden'>
                  <Image width={64} height={64} src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="tourguide image" />
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    name="Image"
                    onChange={(e) => {
                      setImage(e.target.files[0])
                    }}
                    className="hidden w-full h-full"
                  />
                </div>
              ) : (
                <div className='relative flex items-center justify-center cursor-pointer bg-gray-300 w-16 h-16 rounded-full overflow-hidden'>
                    <UploadIcon size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                      name="Image"
                      onChange={(e) => {
                        setImage(e.target.files[0])
                      }}
                      className="hidden w-full h-full"
                    />
                </div>
              )}
            </label>
          </div>
          <div>
            <label>
              <strong>New Mobile Number:</strong>
              <input
                type="number"
                name="MobileNumber"
                value={formData.MobileNumber}
                onChange={handleInputChange}
                className="border p-2 w-full mb-4"
                placeholder={`old: ${tourguide.MobileNumber}`}
                required
              />
            </label>
          </div>
          <div>
            <label>
              <strong>New Years Of Experience:</strong>
              <input
                type="number"
                name="YearsOfExperience"
                value={formData.YearsOfExperience}
                onChange={handleInputChange}
                className="border p-2 w-full mb-4"
                placeholder={`old: ${tourguide.YearsOfExperience}`}
                required
              />
            </label>
          </div>
          <div>
            <label>
              <strong>New Previous Work: (if any) </strong>
              <input
                type="text"
                name="PreviousWork"
                value={formData.PreviousWork}
                onChange={handleInputChange}
                className="border p-2 w-full mb-4"
                placeholder={`old: ${tourguide.PreviousWork}`}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Email</strong>
              <input
                type="text"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                className="border p-2 w-full mb-4"
                placeholder={`old: ${tourguide.UserId.Email}`}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Old Password:</strong>
              <input
                type="password"
                name="OldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border p-2 w-full mb-4"
              />
            </label>
          </div>
          <div>
            <label>
              <strong>New Password:</strong>
              <input
                type="password"
                name="NewPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 w-full mb-4"
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
                  className="border p-2 w-full mb-4"
                  required
                />
              </label>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Edit
          </button>
        </form>
      ) : (
        <h1>You are NOT accepted by the system</h1>
      )}
    </div>
  );
}

export default Tourguideprofile;
