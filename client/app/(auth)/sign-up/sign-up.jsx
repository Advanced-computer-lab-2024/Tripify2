'use client'
import { Button } from "@/components/ui/ButtonInput"
import {
    RadioCardGroup,
    RadioCardIndicator,
    RadioCardItem,
  } from "@/components/ui/RadioCardGroup"
import { useState } from "react"
import { ArrowRight } from 'lucide-react';
import Link from "next/link";

export default function SignUp() 
{
    const [role, setRole] = useState("Tourist")

    return (
        <div className='flex flex-col items-center justify-center flex-1 gap-24 p-8'>
            <h1 className='font-semibold text-4xl font-poppins'>Welcome to Tripify!</h1>
            <div className='flex flex-col gap-6'>
                <h2 className='font-medium text-2xl font-poppins'>I am a...</h2>
                <RadioCardGroup RadioCardGroup value={role} onValueChange={(value) => setRole(value)} className='w-screen max-w-[340px] flex flex-col gap-8'>
                    <RadioCardItem value="Tourist">
                        <div className="flex items-start gap-3">
                        <RadioCardIndicator className="mt-1 outline-none" />
                        <div>
                            <span className="sm:text-base">Tourist</span>
                            <p className="mt-1 text-xs text-gray-500">Looking to explore new places and experiences</p>
                        </div>
                        </div>
                    </RadioCardItem>
                    <RadioCardItem value="Advertiser">
                        <div className="flex items-start gap-3">
                        <RadioCardIndicator className="mt-1 outline-none" />
                        <div>
                            <span className="sm:text-base">Advertiser</span>
                            <p className="mt-1 text-xs text-gray-500">Looking to promote my business and attract customers</p>
                        </div>
                        </div>
                    </RadioCardItem>
                    <RadioCardItem value="TourGuide">
                        <div className="flex items-start gap-3">
                        <RadioCardIndicator className="mt-1 outline-none" />
                        <div>
                            <span className="sm:text-base">Tour Guide</span>
                            <p className="mt-1 text-xs text-gray-500">Looking to provide guided tours and experiences</p>
                        </div>
                        </div>
                    </RadioCardItem>
                    <RadioCardItem value="Seller">
                        <div className="flex items-start gap-3">
                        <RadioCardIndicator className="mt-1 outline-none" />
                        <div>
                            <span className="sm:text-base">Seller</span>
                            <p className="mt-1 text-xs text-gray-500">Looking to sell high-quality products to customers</p>
                        </div>
                        </div>
                    </RadioCardItem>
                    <Link href={`/sign-up/${role.toLowerCase()}`} className='flex items-center justify-center gap-2 w-full'>
                        <Button className='flex items-center justify-center gap-2 w-full'>
                            Continue <ArrowRight stroke='#fff' size={18} />
                        </Button>
                    </Link>
                </RadioCardGroup>
            </div>
        </div>
    )
}