"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";

export default function Dashboard({ params }) {
  const { role } = params;
  const router = useRouter();
  const pathname = usePathname();
  const [activeSublinks, setActiveSublinks] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [hamburgerThreshold, setHamburgerThreshold] = useState(0);

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
        { name: "Explore", link: "/explore" },
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
        { name: "My Profile", link: "/MyProfile" },
        { name: "My Activities", link: "/MyActivities" },
        // { name: "Statistics", link: "/statistics" },
        // { name: "Billing", link: "/billing" },
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
    setSidebarVisible(false);
  };

  const toggleSublinks = (index) => {
    setActiveSublinks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const checkMenuVisibility = () => {
    const navbar = document.querySelector(".navbar-links");
    if (navbar) {
      const availableWidth = window.innerWidth - 70;
      const elementWidth = navbar.scrollWidth;
      const isOverflowing = elementWidth > availableWidth;

      if (isOverflowing && !showHamburger) {
        setHamburgerThreshold(availableWidth);
        setShowHamburger(true);
      } else if (!isOverflowing && showHamburger) {
        setShowHamburger(false);
      }
    }
  };

  useEffect(() => {
    checkMenuVisibility();
    window.addEventListener("resize", checkMenuVisibility);

    return () => {
      window.removeEventListener("resize", checkMenuVisibility);
    };
  }, [sidebarVisible]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > hamburgerThreshold) {
        setShowHamburger(false);
        if (sidebarVisible) {
          setSidebarVisible(false);
        }
      } else if (window.innerWidth <= hamburgerThreshold) {
        checkMenuVisibility();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hamburgerThreshold, sidebarVisible]);

  return (
    <div className="flex justify-between items-center bg-white text-black p-4 border-b border-gray-300">
      <div className="flex-shrink-0">
        <h3 className="text-lg font-bold">Logo</h3>
      </div>

      <div className="flex items-center space-x-4">
        {showHamburger ? (
          <button
            onClick={toggleSidebar}
            className="text-black text-2xl p-2 focus:outline-none"
          >
            <FiMenu />
          </button>
        ) : (
          <div className={`navbar-links flex-grow overflow-auto`}>
            <nav className="flex space-x-4 p-4">
              {dashboardElements.map((element, index) => {
                const isActive = pathname === element.link;
                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => {
                        if (element.sublinks) toggleSublinks(index);
                        else handleReroute(element.link);
                      }}
                      className={`text-black font-normal py-2 px-4 rounded transition duration-300 ease-in-out ${
                        isActive ? "underline" : ""
                      }`}
                    >
                      {element.name}
                    </button>
                    {activeSublinks.includes(index) && element.sublinks && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
                        {element.sublinks.map((sublink, sublinkIndex) => (
                          <button
                            key={sublinkIndex}
                            onClick={() => handleReroute(sublink.link)}
                            className={`block text-left w-full py-2 px-4 text-black hover:bg-gray-200 transition duration-300 ease-in-out ${
                              pathname === sublink.link ? "underline" : ""
                            }`}
                          >
                            {sublink.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        )}
      </div>
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-100 z-20 transform ${
          sidebarVisible ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={toggleSidebar}
          className="text-xl p-4 absolute right-2 top-2"
        >
          ✕
        </button>
        <nav className="flex flex-col p-4">
          {dashboardElements.map((element, index) => (
            <button
              key={index}
              onClick={() => handleReroute(element.link)}
              className="text-black font-normal py-2 px-4 rounded hover:bg-gray-200 transition duration-300 ease-in-out"
            >
              {element.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
