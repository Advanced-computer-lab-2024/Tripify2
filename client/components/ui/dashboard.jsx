"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { Plane } from "lucide-react";
import Link from "next/link";
import LogoutBtn from "@/components/ui/LogoutBtn";
import Notifications from "@/components/shared/Notifications";
import AccountTourist from "@/components/ui/AccountTourist";
import AccountGuest from "@/components/ui/AccountGuest";

import localFont from "next/font/local";

const geistMono = localFont({ src: "../../public/fonts/GeistMonoVF.woff" });
const geistSans = localFont({ src: "../../public/fonts/GeistVF.woff" });

export default function Dashboard({ params }) {
  const { role, id } = params;
  const router = useRouter();
  const pathname = usePathname();
  const sublinkRef = useRef();
  const [activeSublinks, setActiveSublinks] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [hamburgerThreshold, setHamburgerThreshold] = useState(0);

  let dashboardElements;
  switch (role) {
    case "Tourist":
      dashboardElements = [
        {
          name: "Products",
          link: "/products-tourist",
          sublinks: [
            { name: "All Products", link: "/products-tourist" },
            {
              name: "My Orders",
              link: "/products-tourist/current-products",
            },
            { name: "My Products", link: "/products-tourist/my-products" },
            { name: "My Wishlist", link: "/products-tourist/wishlist" },
            { name: "My Cart", link: "/cart" },
          ],
        },
        { name: "Places", link: "/places" },
        {
          name: "Activities",
          link: "/activities",
          sublinks: [
            { name: "All Activities", link: "/activities" },
            { name: "My Activities", link: "/activities/my-activities" },
          ],
        },
        {
          name: "Itineraries",
          link: "/itinerary",
          sublinks: [
            { name: "All Itineraries", link: "/itinerary" },
            { name: "My Itineraries", link: "/itinerary/my-itineraries" },
          ],
        },
        {
          name: "Flights",
          sublinks: [
            { name: "All Flights", link: "/flights" },
            { name: "My Flights", link: "/flights/my-flights" },
          ],
        },
        {
          name: "Hotels",
          sublinks: [
            { name: "All Hotels", link: "/hotels" },
            { name: "My Hotels", link: "/hotels/my-hotels" },
          ],
        },
        {
          name: "Transportation",
          sublinks: [
            { name: "All Transportation", link: "/transportations" },
            {
              name: "My Transportation",
              link: "/transportations/my-transportation",
            },
          ],
        },
        { name: "Explore", link: "/" },
        { name: "Bookmarked", link: "/bookmarked" },
      ];
      break;
    case "Tour Guide":
      dashboardElements = [
        { name: "Account", link: "/myprofile" },
        { name: "My Itineraries", link: "/myitineraries" },
        { name: "Create Itinerary", link: "/createitinerary" },
        { name: "Sales Report", link: "/sales-report" },
        { name: "Tourists Report", link: "/tourists-report" },
      ];
      break;
    case "Advertiser":
      dashboardElements = [
        { name: "Account", link: "/profile" },
        { name: "My Activities", link: "/my-activities" },
        { name: "Create Activity", link: "/my-activities/createActivity" },
        { name: "Sales Report", link: "/sales-report" },
        { name: "Tourists Report", link: "/tourists-report" },
      ];
      break;
    case "Seller":
      dashboardElements = [
        { name: "Account", link: `/account/${id}` },
        { name: "My Products", link: "/myProducts" },
        { name: "Orders", link: "/orders" },
        { name: "Sales Stats", link: "/salesStats" },
      ];
      break;
    case "Tourism Governor":
      dashboardElements = [
        { name: "Change Password", link: "/change-password" },
        { name: "Create Place", link: "/create-place" },
        { name: "Create Tag", link: "/create-tag" },
        { name: "My Places", link: "/my-places" },
      ];
      break;
    case "Admin":
      dashboardElements = [
        { name: "Account", link: `/account/${id}` },
        { name: "User Management", link: "/userManagment" },
        { name: "System Settings", link: "/systemSettings" },
        { name: "Reports", link: "/reports" },
      ];
      break;
    default:
      dashboardElements = [
        { name: "Itineraries", link: "/itineraries-guest" },
        { name: "Products", link: "/products-guest" },
        // {
        //   name: "Upcoming",
        //   link: "/upcoming",
        //   sublinks: [
        //     { name: "All Upcoming", link: "/upcoming" },
        //     { name: "My Upcoming", link: "/myUpcoming" },
        //   ],
        // },
        { name: "Places", link: "/places-guest" },
        { name: "Activities", link: "/activities-guest" },
        { name: "Explore", link: "/explore-guest" },
      ];
  }

  const handleReroute = (route) => {
    router.push(route);
    setSidebarVisible(false);
  };

  const toggleSublinks = (index) => {
    setActiveSublinks((prev) => (prev.includes(index) ? [] : [index]));
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    setActiveSublinks([]);
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
  }, [showHamburger, sidebarVisible]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sublinkRef.current && !sublinkRef.current.contains(event.target)) {
        setActiveSublinks([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sublinkRef]);

  return (
    <div
      className={`${geistSans.className} flex items-center justify-between p-4 text-black bg-white border-b border-gray-300`}
    >
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Plane className="h-6 w-6" />
        <span className="">Tripify</span>
      </Link>

      <div id="heading" className="flex items-center space-x-4">
        {showHamburger ? (
          <button
            onClick={toggleSidebar}
            className="p-2 text-2xl text-black focus:outline-none"
          >
            <FiMenu />
          </button>
        ) : (
          <div
            className={`navbar-links flex-grow overflow-visible relative`}
            ref={sublinkRef}
          >
            <nav className="flex p-4 space-x-4">
              {dashboardElements.map((element, index) => {
                const isActive = pathname === element.link;
                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => {
                        if (element.sublinks) {
                          toggleSublinks(index);
                        } else {
                          handleReroute(element.link);
                        }
                      }}
                      id={
                        element.name.toLowerCase() === "sign up"
                          ? "sign-up"
                          : element.name.toLowerCase()
                      }
                      className={`text-black font-normal py-2 px-4 rounded transition duration-300 ease-in-out ${
                        isActive ? "underline" : ""
                      }`}
                    >
                      {element.name}
                    </button>
                    {activeSublinks.includes(index) && element.sublinks && (
                      <div className="absolute left-0 z-10 w-48 mt-2 bg-white rounded shadow-lg">
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
              {role === "Tourist" ? (
                <AccountTourist theId={id} />
              ) : role === "Guest" ? (
                <AccountGuest />
              ) : (
                ""
              )}
            </nav>
          </div>
        )}
       { role==="Guest"?"":<Notifications />}
      </div>

      {sidebarVisible && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-100 z-20 transform ${
          sidebarVisible ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <nav className="flex flex-col p-4">
          {dashboardElements.map((element, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => {
                  if (element.sublinks) toggleSublinks(index);
                  else handleReroute(element.link);
                }}
                className="px-4 py-2 font-normal text-black transition duration-300 ease-in-out rounded hover:bg-gray-200"
              >
                {element.name}
              </button>
              {activeSublinks.includes(index) && element.sublinks && (
                <div className="absolute left-0 z-10 w-48 mt-2 bg-white rounded shadow-lg">
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
          ))}
          {role === "Tourist" ? (
            <AccountTourist theId={id} />
          ) : role === "Guest" ? (
            <AccountGuest />
          ) : (
            ""
          )}
        </nav>
      </div>
    </div>
  );
}
