"use client";
import { useState } from "react";
import { FaWallet } from "react-icons/fa"; // Import an icon for the wallet

export default function TouristAccount({ params }) {
  const { touristInfo } = params;
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
      default:
        break;
    }
  };

  const handleEdit = async () => {
    const updatedData = {
      MobileNumber: mobileNumberChange,
      DOB: dobChange,
      Occupation: occupationChange,
      Nationality: nationalityChange,
    };
    try {
      const response = await fetch(`http://localhost:3001/tourists/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const hasChanges =
    mobileNumberChange !== MobileNumber ||
    dobChange !== DOB ||
    occupationChange !== Occupation ||
    nationalityChange !== Nationality;

  const currency = "USD";

  return (
    <div className="flex flex-col items-center p-4 my-10">
      <div className="w-full flex justify-center items-center mb-4">
        <img
          src={imgSrcForNow}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mr-4"
        />
        <div className="flex flex-col justify-left items-left p-4">
          <h1 className="text-purple-600 font-bold text-2xl ">{UserName}</h1>

          <h2 className="text-3xl font-semibold mt-3">
            {currency} {Wallet}
          </h2>

          <div className="flex items-center">
            <FaWallet className="text-purple-600 w-5 h-5 mr-1" />
            <p className="text-sm text-gray-700">Current balance</p>
          </div>
        </div>
      </div>

      <div className="relative w-full mt-8 border border-gray-300 rounded-md bg-white shadow-md p-4">
        <h2 className="absolute top-[-15px] left-[10%] transform -translate-x-0 bg-white px-2 text-lg font-semibold text-gray-700">
          Information
        </h2>
        <div className="space-y-6 py-5">
          <div className="block w-full">
            <span className="block text-gray-700 font-medium">Username</span>
            <input
              disabled
              placeholder={UserName}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="block w-full">
            <span className="block text-gray-700 font-medium">
              Mobile Number
            </span>
            <input
              value={mobileNumberChange}
              onChange={handleChange("mobile")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out hover:border-purple-500 hover:ring-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="block">
              <span className="block text-gray-700 font-medium">
                Date of Birth
              </span>
              <input
                type="date"
                value={dobChange}
                onChange={handleChange("dob")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out hover:border-purple-500 hover:ring-2"
              />
            </div>
            <div className="block">
              <span className="block text-gray-700 font-medium">
                Occupation
              </span>
              <input
                value={occupationChange}
                onChange={handleChange("occupation")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out hover:border-purple-500 hover:ring-2"
              />
            </div>
          </div>
          <div className="block w-full">
            <span className="block text-gray-700 font-medium">Nationality</span>
            <input
              value={nationalityChange}
              onChange={handleChange("nationality")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out hover:border-purple-500 hover:ring-2"
            />
          </div>
        </div>

        <div className="flex justify-center mt-4">
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
        </div>
      </div>
    </div>
  );
}
