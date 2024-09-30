"use client";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Import useState

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
    //ghayar classNames ==> tailwind
    <div className="dashboard-container">
      <div className="dashboard--left">
        <h3>Logo</h3>
      </div>
      <div className="dashboard--right">
        {dashboardElements.map((element, index) => {
          return (
            <div key={index}>
              <button
                onClick={() => {
                  if (element.sublinks) toggleSublinks(index);
                  else handleReroute(element.link);
                }}
              >
                {element.name}
              </button>
              {activeSublinks.includes(index) && (
                <div className="sublinks-container">
                  {element.sublinks.map((sublink, sublinkIndex) => (
                    <button
                      key={sublinkIndex}
                      onClick={() => handleReroute(sublink.link)}
                    >
                      {sublink.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button onClick={() => handleReroute("/signout")}>Sign Out</button>
      </div>
    </div>
  );
}
