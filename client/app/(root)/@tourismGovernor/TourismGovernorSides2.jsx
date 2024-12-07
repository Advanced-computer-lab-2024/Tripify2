"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Table,
  Store,
  UserCircle,
  Castle,
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
          pathname === "/" || pathname === "/my-places"
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <Castle className="w-5 h-5" />
        My Places
      </Link>

      <Link
        href="/create-place"
        className={cn(
          "flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground",
          pathname.includes("/create-place")
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <CirclePlus className="w-4 h-4" />
        Create Place
      </Link>
      <Link
        href="/create-tag"
        className={cn(
          "flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground",
          pathname.includes("/create-tag")
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <CirclePlus className="w-4 h-4" />
        Create Tag
      </Link>
    </>
  );
}
