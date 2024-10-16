'use client'

import LocationViewer from "@/components/shared/LoactionViewer"
import { Button } from "@/components/ui/button"
import { Callout } from "@/components/ui/Callout"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { fetcher } from "@/lib/fetch-client"
import { EyeIcon, Flag, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ItineraryActions({ itinerary })
{
    const router = useRouter()

    const [view, setView] = useState(false)
    const [flag, setFlag] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleFlagItinerary = async () => {
        setLoading(true)
        try 
        {
            const response = await fetcher(`/itineraries/flag/${itinerary._id}`, {
                method: 'PATCH'
            })
            if (!response?.ok) {
                setLoading(false)
                setError('Failed to flag itinerary')
            }
            else 
            {
                setFlag(false)
                setLoading(false)
                router.refresh()
            }
        } 
        catch (error) 
        {
            console.error(error)
        }
    }

    return (
        <>
            <div className="flex items-center justify-center gap-6">
                <div onClick={() => setView(true)} className='flex items-center justify-center gap-1 cursor-pointer'>
                    <EyeIcon size={16} />
                    View
                </div>
                {itinerary?.Inappropriate ? (
                    <div className='flex items-center justify-center gap-1 text-red-700 cursor-pointer'>
                        <Flag size={16} fill='#b91c1c' stroke="#b91c1c" />
                        Flagged
                    </div>
                ) : (
                    <div onClick={() => setFlag(true)} className='flex items-center justify-center gap-1 text-red-700 cursor-pointer'>
                        <Flag size={16} stroke="#b91c1c" />
                        Flag
                    </div>
                )}
            </div>
            <Dialog open={view} onOpenChange={setView}>
                <DialogContent>
                    <DialogHeader>
                        <h2 className="text-lg font-bold">{itinerary?.Name}'s Details</h2>
                    </DialogHeader>
                    <div className='flex flex-wrap w-full gap-8'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Name</label>
                            <p>{itinerary?.Name}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Language</label>
                            <p>{itinerary?.Language}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Accesibility</label>
                            <p>{itinerary?.Accesibility ? 'Open' : 'Closed'}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Activities</label>
                            {itinerary?.Activities.map((activity, index) => (
                                <p key={index}>Type: {activity.type}<br /> Duration: {activity.duration}</p>
                            ))}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Price</label>
                            <p>${itinerary?.Price}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Pickup</label>
                            <p>{itinerary?.Pickup}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Dropoff</label>
                            <p>{itinerary?.Dropoff}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>StartDate</label>
                            <p>{new Date(itinerary?.StartDate).toDateString()}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>EndDate</label>
                            <p>{new Date(itinerary?.EndDate).toDateString()}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Created At</label>
                            <p>{new Date(itinerary?.createdAt).toDateString()}</p>
                        </div>
                        <div className='flex flex-col min-w-full gap-1'>
                            <label className='text-sm font-semibold'>Location</label>
                            <LocationViewer location={itinerary?.Location} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={flag} onOpenChange={setFlag}>
                <DialogContent>
                    <DialogHeader>
                        <h2 className="text-lg font-bold">Are you sure you want to flag "{itinerary?.Name}"</h2>
                    </DialogHeader>
                    <DialogFooter>
                        <Button className='w-20' onClick={() => setFlag(false)} variant='default'>Close</Button>
                        <Button onClick={handleFlagItinerary} className='w-20' variant='destructive'>
                            {loading ? <Loader2 size={16} className='animate-spin' /> : 'Flag'}
                        </Button>
                    </DialogFooter>
                    {error && (
                        <Callout variant="error" title="Something went wrong">
                            {error}
                        </Callout>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}