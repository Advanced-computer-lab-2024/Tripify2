"use client";
import { useRouter } from "next/navigation";
export default function MainPageGuest() {
  const router = useRouter();
  return (
    <div className="h-screen flex items-center justify-start p-10">
      <div className="max-w-xlg">
        {/* Main Heading */}
        <h1 className="text-9xl font-extrabold text-gray-800 leading-snug mb-6">
          Plan Your <br /> Dream Trip
        </h1>

        {/* Description */}
        {/* <div className="max-w-lg"> */}
        <p className="text-2xl text-gray-600 mb-12">
          Discover new destinations, organize your perfect getaway, and embark
          on a journey of a lifetime.
        </p>
        {/* </div> */}

        {/* Buttons */}
        <div className="flex space-x-6 gap-3">
          <button
            onClick={() => {
              router.push("/explore-guest");
            }}
            className="bg-purple-600 text-white font-bold py-6 px-12 text-2xl shadow-md hover:bg-purple-500 transition duration-300"
          >
            PLAN YOUR TRIP
          </button>
          <button
            onClick={() => {
              router.push("/sign-up");
            }}
            className="bg-gray-200 text-gray-800 font-bold py-6 px-12 text-2xl shadow-md hover:bg-gray-300 transition duration-300"
          >
            JOIN THE COMMUNITY
          </button>
        </div>
      </div>
    </div>
  );
}
