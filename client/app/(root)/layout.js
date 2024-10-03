import Dashboard from "@/components/ui/dashboard";

import "../globals.css";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
  guest,
  admin,
  advertiser,
  seller,
  tourGuide,
  tourismGovernor,
  tourist,
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <Dashboard params={{ role: "Tourist" }} />
        </header>
        {tourist}
      </body>
    </html>
  );
}
