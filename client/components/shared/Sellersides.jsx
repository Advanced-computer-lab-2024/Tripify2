'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import {Package, Table, Store, UserCircle} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sellersides() {
    const pathname = usePathname();

    return (
        <>
            <Link
                href="/"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname === "/"  || pathname === "/products" ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Package className="w-4 h-4" />
                Products
            </Link>

            <Link
                href="/createproduct"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/createproduct") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Store className="w-4 h-4" />
                Post a Product for Sale
            </Link>
            <Link
                href="/sales-report"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/sales-report") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <Table className="w-4 h-4" />
                Sales Report
            </Link>
            <Link
                href="/seller-profile"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black", pathname.includes("/seller-profile") ? "bg-muted text-black" : "text-muted-foreground")}
            >
                <UserCircle className="w-4 h-4" />
                My Profile
            </Link>
        </>
    )
}