"use client";
import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { fetcher } from "@/lib/fetch-client";
import { signOut, useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Button } from "./button";
import { useCurrencyStore } from "@/providers/CurrencyProvider";

export default function TouristAccount({ params }) {
  const { touristInfo } = params;
  const { currency, setCurrency } = useCurrencyStore()

  const Session = useSession();
  const touristDetails = Object.entries(touristInfo).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
  const { UserName, MobileNumber, DOB, Occupation, Wallet, Nationality, _id } =
    touristDetails;

  const imgSrcForNow =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const [mobileNumberChange, setMobileNumberChange] = useState(MobileNumber);
  const [dobChange, setDobChange] = useState(DOB);
  const [occupationChange, setOccupationChange] = useState(Occupation);
  const [nationalityChange, setNationalityChange] = useState(Nationality);
  const [theEmailChange, setTheEmailChange] = useState(
    touristInfo.UserId.Email
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    switch (field) {
      case "mobile":
        setMobileNumberChange(e.target.value);
        break;
      case "dob":
        setDobChange(e.target.value);
        break;
      case "occupation":
        setOccupationChange(e.target.value);
        break;
      case "nationality":
        setNationalityChange(e.target.value);
        break;
      case "email":
        setTheEmailChange(e.target.value);
        break;
      case "oldPassword":
        setOldPassword(e.target.value);
        break;
      case "newPassword":
        setNewPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleEdit = async () => {
    const newUserId = {
      ...touristInfo.UserId,
      Email: theEmailChange,
    };
    const updatedData = {
      MobileNumber: mobileNumberChange,
      DOB: dobChange,
      Occupation: occupationChange,
      Nationality: nationalityChange,
      UserId: newUserId,
    };
    try {
      const usersResponse = await fetcher("/users", {
        method: "GET",
        heeader: {
          "Content-Type": "application/json",
        },
      }).catch((e) => console.log(e));

      if (!usersResponse.ok) {
        throw new Error("Network response was not ok!");
      }

      const dataForUsers = await usersResponse.json();

      const validEmail = dataForUsers.some((user) => {
        return (
          user._id !== touristInfo.UserId._id && user.Email === theEmailChange
        );
      });

      if (validEmail) {
        alert("Email already exists on the system!");
      } else {
        if (oldPassword !== "" && newPassword !== "") {
          const changePasswordRes = await fetcher(`/users/change-password/${Session?.data?.user?.userId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ oldPassword, newPassword }),
          })

          if (!changePasswordRes.ok) {
            throw new Error("Network response was not ok!");
          }
        }
        const responseUserTwo = await fetcher(
          `/users/${touristInfo.UserId._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Email: theEmailChange }),
          }
        );

        if (!responseUserTwo.ok) {
          throw new Error("Network response was not ok!");
        }
        const response = await fetcher(`/tourists/${Session.data.user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }).catch((e) => console.log(e));

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      }
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const hasChanges =
    mobileNumberChange !== MobileNumber ||
    dobChange !== DOB ||
    occupationChange !== Occupation ||
    nationalityChange !== Nationality ||
    theEmailChange !== touristDetails.UserId.Email ||
    (oldPassword !== "" && newPassword !== "");

  return (
    <div className="flex flex-col items-center p-4 my-10">
      <div className="flex items-center justify-center w-full mb-4">
        <img
          src={imgSrcForNow}
          alt="User Avatar"
          className="w-24 h-24 mr-4 rounded-full"
        />
        <div className="flex flex-col p-4 justify-left items-left">
          <h1 className="text-2xl font-bold text-purple-600 ">{UserName}</h1>

          <h2 className="mt-3 text-3xl font-semibold">
            {currency} {Wallet}
          </h2>

          <div className="flex items-center">
            <FaWallet className="w-5 h-5 mr-1 text-purple-600" />
            <p className="text-sm text-gray-700">Current balance</p>
          </div>
        </div>
      </div>

      <div className="relative w-full p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-md">
        <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
          Information
        </h2>
        <div className="py-5 space-y-6">
          <div className="block w-full">
            <span className="block font-medium text-gray-700">Username</span>
            <input
              disabled
              placeholder={UserName}
              className="block w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="block w-full">
            <span className="block font-medium text-gray-700">
              Mobile Number
            </span>
            <input
              value={mobileNumberChange}
              onChange={handleChange("mobile")}
              className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
            />
          </div>
          <div className="block w-full">
            <span className="block font-medium text-gray-700">Email</span>
            <input
              value={theEmailChange}
              onChange={handleChange("email")}
              className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="block">
              <span className="block font-medium text-gray-700">
                Date of Birth
              </span>
              <input
                type="date"
                value={dobChange}
                onChange={handleChange("dob")}
                className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
              />
            </div>
            <div className="block">
              <span className="block font-medium text-gray-700">
                Occupation
              </span>
              <input
                value={occupationChange}
                onChange={handleChange("occupation")}
                className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
              />
            </div>
          </div>
          <div className="block w-full">
            <span className="block font-medium text-gray-700">Nationality</span>
            <input
              value={nationalityChange}
              onChange={handleChange("nationality")}
              className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
            />
          </div>
          <div className="block w-full">
            <span className="block font-medium text-gray-700">Currency</span>
            <select onChange={(e) => setCurrency(['USD', 'EUR', 'EGP'].includes(e.target.value) ? e.target.value : currency)} defaultValue={currency} className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2">
              {['USD', 'EUR', 'EGP'].map((curr, i) => (
                <option key={i} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
          <div className="relative block w-full">
            <span className="block font-medium text-gray-700">Old Password</span>
            <input
              value={oldPassword}
              type='password'
              onChange={handleChange("oldPassword")}
              className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
            />
          </div>
          <div className="block w-full">
            <span className="block font-medium text-gray-700">New Password</span>
            <input
              value={newPassword}
              type='password'
              onChange={handleChange("newPassword")}
              className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleEdit}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-md transition duration-200 ${
              hasChanges
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setRequestOpen(true)}
            className="px-4 text-white bg-red-500 rounded"
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
                  await fetcher(`/users/request-deletion/${Session?.data.user?.userId}`, {
                    method: 'POST'
                  })
                  await signOut({ redirect: true, callbackUrl: '/' })
                  setLoading(false)
                }}>Request Deletion</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
