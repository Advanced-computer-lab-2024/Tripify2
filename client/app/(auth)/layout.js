import { GeistSans } from "geist/font/sans"; 
import { Poppins } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import "../globals.css";
import AuthProvider from "@/providers/SessionProvider";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ourFileRouter } from "../api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";

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
}) {

  const session = await getSession();

  if(session?.user) return redirect('/')

  return (
    <html lang="en" className={`${GeistSans.className} ${poppins.variable} antialiased dark:bg-gray-950 bg-[#F7FAFC]`}>
      <AuthProvider>
        <body className="bg-[#F7FAFC]">
          <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          {/* <header>
            <Dashboard params={{ role: "Advertiser" }} />
          </header> */}
          <main className='flex w-full min-h-screen font-poppins'>
            {children}
            <div className='flex items-center relative justify-center flex-1'>
                <Image
                    src='/images/sign-up-hero.png' 
                    fill
                    alt='Sign Up'
                    className='object-fill'
                    quality={100}
                />
            </div>
          </main>
        </body>
      </AuthProvider>
    </html>
  );
}
