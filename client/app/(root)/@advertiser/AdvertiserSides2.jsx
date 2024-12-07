"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Table,
  Store,
  UserCircle,
  FerrisWheel,
  CirclePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sellersides2() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className={cn(
          "flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground",
          pathname === "/" || pathname === "/my-activities"
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <FerrisWheel className="w-5 h-5" />
        My Activities
      </Link>

      <Link
        href="/my-activities/createActivity"
        className={cn(
          "flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground",
          pathname.includes("/createActivity")
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <CirclePlus className="w-4 h-4" />
        Create Activity
      </Link>
      <Link
        href="/sales-report"
        className={cn(
          "flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground",
          pathname.includes("/sales-report")
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <Table className="w-4 h-4" />
        Sales Report
      </Link>
      <Link
        href="/tourists-report"
        className={cn(
          "flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground",
          pathname.includes("/tourists-report")
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <Table className="w-4 h-4" />
        Tourists Report
      </Link>
      <Link
        href="/profile"
        className={cn(
          "flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground",
          pathname.includes("/profile")
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <UserCircle className="w-4 h-4" />
        My Profile
      </Link>
    </>
  );
}
