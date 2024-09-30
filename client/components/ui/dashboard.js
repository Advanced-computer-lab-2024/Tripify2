"use client";
import { useRouter } from "next/navigation";

export default function Dashboard({ params }) {
  const { role } = params;
  const router = useRouter();

  let dashboardElements;
  switch (role) {
    case "Tourist":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "Bought Products", link: "/boughtProducts" },
        { name: "Upcoming", link: "/upcoming" },
      ];
      break;
    case "Tour Guide":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "My Tours", link: "/myTours" },
        { name: "Schedule", link: "/schedule" },
        "Earnings",
      ];
      break;
    case "Advertiser":
      dashboardElements = [
        { name: "Account", link: "/account" },
        { name: "Ad Campaigns", link: "adCampagins" },
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

  return (
    //ghayar classNames ==> tailwind
    <div className="dashboard-container">
      <div className="dashboard--left">
        <h3>Logo</h3>
      </div>
      <div className="dashboard--right">
        {dashboardElements.map((element, index) => {
          return (
            <button onClick={() => handleReroute(element.link)} key={index}>
              {element.name}
            </button>
          );
        })}
        <button onClick={() => handleReroute("/signout")}>Sign Out</button>
      </div>
    </div>
  );
}
