// @tourist/layout.js
import Dashboard from "@/components/ui/dashboard";
import { getSession } from "@/lib/session";

import localFont from "next/font/local";

const geistMono = localFont({ src: "../../../public/fonts/GeistMonoVF.woff" });
const geistSans = localFont({ src: "../../../public/fonts/GeistVF.woff" });

import { CurrencyStoreProvider } from "@/providers/CurrencyProvider";
import Footer from "@/components/shared/Footer";

export default async function TouristLayout({ children }) {
  const Session = await getSession();

  return (
    <body className={geistSans.className}>
      <header>
        <Dashboard
          params={{
            role: "Tourist",
            /*id: "67001e91b4ba61e78487b585"*/ id: Session?.user?.id,
          }}
        />
      </header>
      <main>{children}</main>
      {/* <Footer /> */}
    </body>
  );
}
