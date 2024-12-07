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
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sellersides() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black",
          pathname === "/" || pathname === "/my-places"
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <Castle className="w-4 h-4" />
        My Places
      </Link>

      <Link
        href="/create-place"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black",
          pathname.includes("/create-place")
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <CirclePlus className="w-4 h-4" />
        Create Place
      </Link>
      <Link
        href="/my-tags"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black",
          pathname.includes("/create-tag")
            ? "bg-muted text-black"
            : "text-muted-foreground"
        )}
      >
        <Tags className="w-4 h-4" />
        My Tags
      </Link>
      <Link
        href="/create-tag"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black",
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
