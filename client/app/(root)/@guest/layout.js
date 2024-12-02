// @tourist/layout.js
import Dashboard from "@/components/ui/dashboard";

import localFont from "next/font/local";

const geistMono = localFont({ src: "../../../public/fonts/GeistMonoVF.woff" });
const geistSans = localFont({ src: "../../../public/fonts/GeistVF.woff" });

export default async function GuestLayout({ children }) {
  return (
    <html lang="en">
      <body className={geistSans.className}>
        <header>
          <Dashboard
            params={{
              role: "Guest",
              /*id: "67001e91b4ba61e78487b585"*/ id: "",
            }}
          />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
