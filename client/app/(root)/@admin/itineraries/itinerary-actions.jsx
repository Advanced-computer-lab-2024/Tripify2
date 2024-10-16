'use client'

import { EyeIcon, Flag } from "lucide-react"

export default function ItineraryActions({ itinerary })
{
    return (
        <>
            <div className="flex items-center justify-center gap-6">
                <div className='flex items-center justify-center gap-1 cursor-pointer'>
                    <EyeIcon size={16} />
                    View
                </div>
                <div className='flex text-red-700 items-center justify-center gap-1 cursor-pointer'>
                    <Flag size={16} stroke="#b91c1c" />
                    Flag
                </div>
            </div>
        </>
    )
}