'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Binoculars, Container, FileUser, Package, ShieldHalf, Tags, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SideBarLinks() {
    const pathname = usePathname();

    return (
        <>
            <Link
            href="/"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname === "/" ? "bg-muted text-black" : "text-muted-foreground")}
            >
            <Users className="h-4 w-4" />
            Users
            </Link>
            <Link
            href="/applications"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/applications") ? "bg-muted text-black" : "text-muted-foreground")}
            >
            <FileUser className="h-4 w-4" />
            Applications
            </Link>
            <Link
            href="/products"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/products") ? "bg-muted text-black" : "text-muted-foreground")}
            >
            <Package className="h-4 w-4" />
            Products{" "}
            </Link>
            <Link
            href="/categories"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/categories") ? "bg-muted text-black" : "text-muted-foreground")}
            >
            <Container className="h-4 w-4" />
            Categories{" "}
            </Link>
            <Link
            href="/tags"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/tags") ? "bg-muted text-black" : "text-muted-foreground")}
            >
            <Tags className="h-4 w-4" />
            Tags
            </Link>
            <Link
            href="/admins"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/admins") ? "bg-muted text-black" : "text-muted-foreground")}
            >
            <ShieldHalf className="h-4 w-4" />
            Admins
            </Link>
            <Link
            href="/tourism-governors"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/tourism-governors") ? "bg-muted text-black" : "text-muted-foreground")}
            >
            <Binoculars className="h-4 w-4" />
            Tourism Governors
            </Link>
        </>
    )
}