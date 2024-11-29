"use client";
import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { fetcher } from "@/lib/fetch-client";
import { signOut, useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Button } from "./button";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { Coins } from "lucide-react";
import { Badge } from "./badge";
import { cn, convertPrice, convertToUSD } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Callout } from "./Callout";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import { RiDeleteBin5Line } from "@remixicon/react";

export default function TouristAccount({ params }) {
  const { touristInfo } = params;
  const router = useRouter();
  const { currency, setCurrency } = useCurrencyStore();
  const [error, setError] = useState(null);

  const Session = useSession();
  const touristDetails = Object.entries(touristInfo).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
  const {
    UserName,
    MobileNumber,
    DOB,
    Occupation,
    Wallet,
    Nationality,
    _id,
    LoyaltyPoints,
    Badge,
    Address,
  } = touristDetails;

  const imgSrcForNow =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const [mobileNumberChange, setMobileNumberChange] = useState(MobileNumber);
  const [dobChange, setDobChange] = useState(DOB);
  const [occupationChange, setOccupationChange] = useState(Occupation);
  const [nationalityChange, setNationalityChange] = useState(Nationality);
  const [theEmailChange, setTheEmailChange] = useState(
    touristInfo.UserId.Email
  );
  const [addresses, setAddresses] = useState(Address);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({
    name: "",
    coordinates: [],
    type: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addressChanged, setAddressChanged] = useState(false);

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
      Address: addresses,
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
          const changePasswordRes = await fetcher(
            `/users/change-password/${Session?.data?.user?.userId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ oldPassword, newPassword }),
            }
          );

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

  //console.log(addresses);

  const hasChanges =
    mobileNumberChange !== MobileNumber ||
    dobChange !== DOB ||
    occupationChange !== Occupation ||
    nationalityChange !== Nationality ||
    theEmailChange !== touristDetails.UserId.Email ||
    (oldPassword !== "" && newPassword !== "") ||
    addressChanged;

  const handleRedeem = async () => {
    setLoading(true);
    const response = await fetcher(`/tourists/points/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.message);
      return;
    }

    setRedeemOpen(false);
    router.refresh();
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupData({ name: "", coordinates: [], type: "" });
    setIsPopupOpen(false);
  };

  // console.log(
  //   addresses.find((address) => {
  //     console.log(address.name);
  //     return address.name === "Friends";
  //   })
  // );

  const handleSavePopup = () => {
    if (
      popupData.name &&
      addresses.find((address) => address.name === popupData.name)
    )
      setErrorMessage("Please enter an unused Name");
    else if (popupData.name && popupData.coordinates && popupData.type) {
      setAddresses((prev) => [...prev, popupData]);
      setErrorMessage("");
      setAddressChanged(true);
      handleClosePopup();
    } else setErrorMessage("Please enter both Name and Location");
  };

  const handleLocationSelect = (location) => {
    setPopupData((prev) => ({
      ...prev,
      coordinates: location.coordinates,
      type: location.type,
    }));
  };

  const handlePopupNameChange = (e) => {
    setPopupData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleRemoveAddress = (name) => {
    setAddresses((prev) => prev.filter((address) => address.name !== name));
    setAddressChanged(true);
  };

  return (
    <div className="flex flex-col items-center p-4 my-10">
      <div className="flex items-center justify-center w-full mb-4">
        <img
          src={imgSrcForNow}
          alt="User Avatar"
          className="w-24 h-24 mr-4 rounded-full"
        />
        <div className="flex flex-col p-4 justify-left items-left">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold text-purple-600">{UserName}</h1>
            <Badge
              className={cn(
                "rounded-[12px] px-4 h-6 text-white",
                Badge === "Bronze"
                  ? "bg-[#CD7F32]"
                  : Badge === "Silver"
                  ? "bg-[#C0C0C0]"
                  : "bg-[#FFD700]"
              )}
            >
              {Badge}
            </Badge>
          </div>

          <div className="flex items-center justify-start gap-2">
            <div className="flex items-center">
              <FaWallet className="w-6 h-6 mr-1 text-purple-600" />
              {/* <p className="text-base text-gray-700">Current balance</p> */}
            </div>
            <p className="text-2xl font-semibold">
              {currency} {convertPrice(Wallet, currency)}
            </p>
          </div>

          <div className="flex items-center justify-start gap-2 mt-2">
            <div className="flex items-center">
              <Coins className="w-4 h-4 mr-1 text-purple-600" />
              {/* <p className="text-sm text-gray-700">Loyalty Points: </p> */}
            </div>
            <p className="text-base font-light">
              {LoyaltyPoints.toFixed(2)}{" "}
              {LoyaltyPoints > 1 ? "points" : "point"}
            </p>
            <p
              onClick={() => setRedeemOpen(true)}
              className="text-xs underline cursor-pointer font-extralight"
            >
              Redeem
            </p>
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
            <select
              onChange={(e) =>
                setCurrency(
                  ["USD", "EUR", "EGP"].includes(e.target.value)
                    ? e.target.value
                    : currency
                )
              }
              defaultValue={currency}
              className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
            >
              {["USD", "EUR", "EGP"].map((curr, i) => (
                <option key={i} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
          <div className="relative block w-full">
            <span className="block font-medium text-gray-700">
              Old Password
            </span>
            <input
              value={oldPassword}
              type="password"
              onChange={handleChange("oldPassword")}
              className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
            />
          </div>
          <div className="block w-full">
            <span className="block font-medium text-gray-700">
              New Password
            </span>
            <input
              value={newPassword}
              type="password"
              onChange={handleChange("newPassword")}
              className="block w-full p-2 mt-1 transition duration-200 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-500 hover:ring-2"
            />
          </div>
          <div className="block w-full">
            <span className="block font-medium text-gray-700">
              Saved Addresses
            </span>
            <div className="flex items-center mt-1">
              <div className="relative w-full">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="block w-full p-2 transition duration-200 ease-in-out border border-gray-300 rounded-md bg-gray-100 text-gray-400 cursor-pointer"
                >
                  {addresses.length > 0
                    ? addresses[0].name
                    : "No Saved Addresses"}
                </button>

                {isDropdownOpen && (
                  <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {addresses.length > 0 ? (
                      addresses.map((address) => (
                        <li
                          key={address.name}
                          className="flex items-center justify-between p-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                        >
                          <span>{address.name}</span>
                          <button
                            onClick={() => handleRemoveAddress(address.name)}
                            className="ml-2 p-1 text-red-500 hover:text-red-700"
                          >
                            <RiDeleteBin5Line size={18} />
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No Saved Addresses</li>
                    )}
                  </ul>
                )}
              </div>

              <button
                onClick={handleOpenPopup}
                className="ml-2 p-2 text-white bg-purple-500 rounded-md transition duration-200 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                +
              </button>
            </div>
          </div>
        </div>
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add Address</h2>
              {errorMessage && (
                <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
              )}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  value={popupData.name}
                  onChange={handlePopupNameChange}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Location:</h3>
                <LocationPicker onLocationSelect={handleLocationSelect} />
              </div>

              {/* Display selected location */}
              {popupData.Location && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Selected Location:
                  </h4>
                  <LocationViewer
                    location={{
                      coordinates: popupData.coordinates,
                      type: popupData.type,
                    }}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleClosePopup}
                  className="mr-2 p-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePopup}
                  className="p-2 text-white bg-purple-500 rounded-md hover:bg-purple-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

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
                      `/users/request-deletion/${Session?.data.user?.userId}`,
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
          <Dialog open={redeemOpen} onOpenChange={setRedeemOpen}>
            <DialogContent>
              <DialogHeader>
                Redeem your points for{" "}
                {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
                {convertPrice(
                  convertToUSD(LoyaltyPoints * 0.01, "EGP"),
                  currency
                )}
              </DialogHeader>
              <DialogFooter>
                <Button disabled={loading} onClick={() => setRedeemOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-65"
                  onClick={handleRedeem}
                >
                  Redeem
                </Button>
              </DialogFooter>
              {error && (
                <Callout variant="error" title="Something went wrong">
                  {error}
                </Callout>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
