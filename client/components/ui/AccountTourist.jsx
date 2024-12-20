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
import { Lock, LogOut, CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";
import Notifications from "@/components/shared/Notifications";

export default function AccountTourist({ theId }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };
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
          onClick={() => router.push(`/account/${theId}`)}
        >
          <CircleUser size={16} />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-1 cursor-pointer"
          onClick={() => router.push("/changePassword")}
        >
          <Lock size={16} />
          Change Password
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-1 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* <Notifications/> */}
    </DropdownMenu>
  );
}
