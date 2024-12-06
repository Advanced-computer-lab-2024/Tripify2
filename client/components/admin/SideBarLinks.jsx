'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Binoculars, Container, DeleteIcon, FileUser, MessageCircleWarning, Package, ShieldHalf, Tags, TramFront, Users, Table, Gem, FerrisWheel } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SideBarLinks() {
    const pathname = usePathname();

    return (
        <>
            <Link
                href="/"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname === "/" ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Users className="w-4 h-4" />
                Users
            </Link>
            <Link
                href="/applications"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/applications") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <FileUser className="w-4 h-4" />
                Applications
            </Link>
            <Link
                href="/products"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/products") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Package className="w-4 h-4" />
                Products{" "}
            </Link>
            <Link
                href="/itineraries"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/itineraries") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <TramFront className="w-4 h-4" />
                Itineraries{" "}
            </Link>
            <Link
                href="/activities"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/activities") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <FerrisWheel className="w-4 h-4" />
                Activities{" "}
            </Link>
            <Link
                href="/categories"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/categories") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Container className="w-4 h-4" />
                Categories{" "}
            </Link>
            <Link
                href="/tags"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/tags") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Tags className="w-4 h-4" />
                Tags
            </Link>
            <Link
                href="/admins"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/admins") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <ShieldHalf className="w-4 h-4" />
                Admins
            </Link>
            <Link
                href="/tourism-governors"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/tourism-governors") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Binoculars className="w-4 h-4" />
                Tourism Governors
            </Link>
            <Link
                href="/sales-report"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/sales-report") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Table className="w-4 h-4" />
                Sales Report
            </Link>

            <Link
                href="/complaints"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/complaints") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <MessageCircleWarning className="w-4 h-4" />
                Complaints
            </Link>
            <Link
                href="/delete-requests"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/delete-requests") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <DeleteIcon className="w-4 h-4" />
                Delete Requests
            </Link>
            <Link
                href="/promo-codes"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/promo-codes") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Gem className="w-4 h-4" />
                Promo Codes
            </Link>
        </>
    )
}