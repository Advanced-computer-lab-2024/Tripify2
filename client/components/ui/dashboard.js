"use client";

export default function Dashboard({ params }) {
  const { role } = params;
  let dashboardElements;
  switch (role) {
    case "Tourist":
      dashboardElements = ["Account", "Bought Products", "Upcoming"];
      break;
    case "Tour Guide":
      dashboardElements = ["Account", "My Tours", "Schedule", "Earnings"];
      break;
    case "Advertiser":
      dashboardElements = ["Account", "Ad Campaigns", "Statistics", "Billing"];
      break;
    case "Seller":
      dashboardElements = ["Account", "My Products", "Orders", "Sales Stats"];
      break;
    case "Tourism Governor":
      dashboardElements = ["Account", "Regulations", "Reports", "Approvals"];
      break;
    case "Admin":
      dashboardElements = [
        "Account",
        "User Management",
        "System Settings",
        "Reports",
      ];
      break;
    default:
      dashboardElements = ["Sign in", "Sign up"];
  }

  return (
    //ghayar classNames ==> tailwind
    <div className="dashboard-container">
      <div className="dashboard--left">
        <h3>Logo</h3>
      </div>
      <div className="dashboard--right">
        {dashboardElements.map((element, index) => {
          return <h3 key={index}>{element}</h3>;
        })}
        <h3>Sign Out</h3>
      </div>
    </div>
  );
}
