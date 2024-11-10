'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Binoculars, Container, FileUser, MessageCircleWarning, Package, ShieldHalf, Tags, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SideBarLinks() {
    const pathname = usePathname();

    return (
        <>
            <Link
                href="/"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname === "/" ? "bg-muted text-black" : "text-muted-foreground")}            >
                <Users className="w-5 h-5 transition-all group-hover:scale-110" />
                <span>Users</span>
            </Link>
            <Link
                href="/applications"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname.includes("/applications") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <FileUser className="w-5 h-5" />
                Applications
            </Link>
            <Link
                href="/products"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname.includes("/products") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Package className="w-5 h-5" />
                Products
            </Link>
            <Link
                href="/itineraries"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname.includes("/itineraries") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Package className="w-5 h-5" />
                Itineraries
            </Link>
            <Link
                href="/categories"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname.includes("/categories") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Container className="w-5 h-5" />
                Categories
            </Link>
            <Link
                href="/tags"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname.includes("/tags") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Tags className="w-5 h-5" />
                Tags
            </Link>
            <Link
                href="/admins"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname.includes("/admins") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <ShieldHalf className="w-5 h-5" />
                Admins
            </Link>
            <Link
                href="/tourism-governors"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname.includes("/tourism-governors") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Binoculars className="w-5 h-5" />
                Tourism Governors
            </Link>
            <Link
                href="/complaints"
                className={cn("flex items-center rounded-[4px] gap-4 px-2.5 py-2.5 hover:text-foreground", pathname.includes("/complaints") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <MessageCircleWarning className="w-5 h-5" />
                Complaints
            </Link>
        </>
    )
}