import Dashboard from "@/components/ui/dashboard";
import { GeistSans } from "geist/font/sans"; 

import { Poppins } from "next/font/google";

import "../globals.css";
import { getSession } from "@/lib/session";
import AuthProvider from "@/providers/SessionProvider";

export const metadata = {
  title: "Tripify",
  description: "Tripify is a travel companion app that helps you plan your trips and book accommodations with ease.",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export default async function RootLayout({
  children,
  guest,
  admin,
  advertiser,
  seller,
  tourGuide,
  tourismGovernor,
  tourist,
}) {
  const session = await getSession();

  return (
    <html lang="en" className={`${GeistSans.className} ${poppins.variable} antialiased dark:bg-gray-950`}>
      <AuthProvider>
        <body>
          {/* <header>
            <Dashboard params={{ role: "Advertiser" }} />
          </header> */}
          {session?.user?.role === "Tourist"
            ? tourist
            : session?.user?.role === "Admin"
            ? admin
            : session?.user?.role === "Advertiser"
            ? advertiser
            : session?.user?.role === "Seller"
            ? seller
            : session?.user?.role === "TourGuide"
            ? tourGuide
            : session?.user?.role === "TourismGovernor"
            ? tourismGovernor
            : guest}
        </body>
      </AuthProvider>
    </html>
  );
}
