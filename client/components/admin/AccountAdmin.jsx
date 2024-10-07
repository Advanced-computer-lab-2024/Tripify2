"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    signOut
  } from "next-auth/react"
  import { Button } from "@/components/ui/button"
import Image from "next/image"
export default function AccountAdmin(){
    const handleLogout= async () => {
        await signOut()
    }
    return(
        <DropdownMenu>
                  <DropdownMenuTrigger asChild className='ml-auto'>
                    <Button
                      variant="outline"
                      size="icon"
                      className="overflow-hidden rounded-full"
                    >
                      <Image
                        src="/images/placeholder-user.webp"
                        width={36}
                        height={36}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
    )

}