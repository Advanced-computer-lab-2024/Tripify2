"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard({ params }) {
  const { role } = params;
  const router = useRouter();
  const [activeSublinks, setActiveSublinks] = useState([]);

  let dashboardElements;
  switch (role) {
    case "Tourist":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "Bought Products", link: "/boughtProducts" },
        {
          name: "Upcoming",
          link: "/upcoming",
          sublinks: [
            { name: "All Upcoming", link: "/upcoming" },
            { name: "My Upcoming", link: "/myUpcoming" },
          ],
        },
        {
          name: "Itineraries",
          link: "/itineraries",
          sublinks: [
            { name: "All Itineraries", link: "/itineraries" },
            { name: "My Itineraries", link: "/myItineraries" },
            { name: "Upcoming Itineraries", link: "/upcomingItineraries" },
          ],
        },
      ];
      break;
    case "Tour Guide":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "My Tours", link: "/myTours" },
        { name: "Schedule", link: "/schedule" },
        { name: "Earnings", link: "/earnings" },
      ];
      break;
    case "Advertiser":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "Ad Campaigns", link: "/adCampagins" },
        { name: "Statistics", link: "/statistics" },
        { name: "Billing", link: "/billing" },
      ];
      break;
    case "Seller":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "My Products", link: "/myProducts" },
        { name: "Orders", link: "/orders" },
        { name: "Sales Stats", link: "/salesStats" },
      ];
      break;
    case "Tourism Governor":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "Regulations", link: "/regulations" },
        { name: "Reports", link: "/reports" },
        { name: "Approvals", link: "/approvals" },
      ];
      break;
    case "Admin":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "User Management", link: "/userManagment" },
        { name: "System Settings", link: "/systemSettings" },
        { name: "Reports", link: "/reports" },
      ];
      break;
    default:
      dashboardElements = [
        { name: "Sign in", link: "/signin" },
        { name: "Sign up", link: "/signup" },
      ];
  }

  const handleReroute = (route) => {
    router.push(route);
  };

  const toggleSublinks = (index) => {
    setActiveSublinks((prev) => {
      if (prev.includes(index))
        return prev.filter((element) => element !== index);
      else return [...prev, index];
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 text-white p-4">
      <div className="dashboard--left">
        <h3 className="text-lg font-bold">Logo</h3>
      </div>
      <div className="dashboard--right flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        {dashboardElements.map((element, index) => {
          return (
            <div key={index} className="relative">
              <button
                onClick={() => {
                  if (element.sublinks) toggleSublinks(index);
                  else handleReroute(element.link);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                {element.name}
              </button>
              {activeSublinks.includes(index) && (
                <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded shadow-lg">
                  {element.sublinks.map((sublink, sublinkIndex) => (
                    <button
                      key={sublinkIndex}
                      onClick={() => handleReroute(sublink.link)}
                      className="block text-left w-full py-2 px-4 hover:bg-gray-600 transition duration-300 ease-in-out"
                    >
                      {sublink.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={() => handleReroute("/signout")}
          className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
