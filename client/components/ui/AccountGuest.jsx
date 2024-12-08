"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogIn, UserPlus, CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";
import Notifications from "@/components/shared/Notifications";

export default function AccountGuest({ theId }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-auto">
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
        <DropdownMenuItem
          className="gap-1 cursor-pointer"
          onClick={() => router.push("/sign-in")}
        >
          <LogIn size={16} />
          Sign in
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-1 cursor-pointer"
          onClick={() => router.push("/sign-up")}
        >
          <UserPlus size={16} />
          Sign up
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* <Notifications/> */}
    </DropdownMenu>
  );
}
