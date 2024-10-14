import Link from "next/link"
import SideBarLinks from "@/components/admin/SideBarLinks"
import SideBarLinksSheet from "@/components/admin/SideBarLinksSheet"
import {
  Plane,
  PanelLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import AccountAdmin from "@/components/admin/AccountAdmin"
import localFont from 'next/font/local'

const geistMono = localFont({ src: '../../../public/fonts/GeistMonoVF.woff' })
const geistSans = localFont({ src: '../../../public/fonts/GeistVF.woff' })

export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
  }
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body className={`${geistSans.className}`}>
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Plane className="h-6 w-6" />
                    <span className="">Tripify</span>
                  </Link>
                </div>
                <div className="flex-1">
                  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                      <SideBarLinks />
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                      <PanelLeft className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-2 mt-6 text-lg font-medium">
                      <SideBarLinksSheet />
                    </nav>
                  </SheetContent>
                </Sheet>
                
                <AccountAdmin/>
              </header>
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
              </main>
            </div>
          </div>
        </body>
      </html>
    )
  }
  