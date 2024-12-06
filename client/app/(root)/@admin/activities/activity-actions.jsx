'use client'

import LocationViewer from "@/components/shared/LoactionViewer"
import { Button } from "@/components/ui/button"
import { Callout } from "@/components/ui/Callout"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { fetcher } from "@/lib/fetch-client"
import { EyeIcon, Flag, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ActivityActions({ activity }) {
    const router = useRouter()

    const [view, setView] = useState(false)
    const [flag, setFlag] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    console.log(activity)

    const handleFlagActivity = async () => {
        setLoading(true)
        try {
            const response = await fetcher(`/activities/flag/${activity._id}`, {
                method: 'PATCH'
            })
            if (!response?.ok) {
                setLoading(false)
                setError('Failed to flag activity')
            }
            else {
                setFlag(false)
                setLoading(false)
                router.refresh()
            }
        }
        catch (error) {
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
                {activity?.Inappropriate ? (
                    <div onClick={() => setFlag(true)} className='flex items-center justify-center gap-1 text-red-700 cursor-pointer'>
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
                        <h2 className="text-lg font-bold">{activity?.Name}'s Details</h2>
                    </DialogHeader>
                    <div className='flex flex-wrap w-full gap-8'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Name</label>
                            <p>{activity?.Name}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Accesibility</label>
                            <p>{activity?.Accesibility ? 'Open' : 'Closed'}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Price</label>
                            <p>${activity?.Price}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-semibold'>Created At</label>
                            <p>{new Date(activity?.createdAt).toDateString()}</p>
                        </div>
                        <div className='flex flex-col min-w-full gap-1'>
                            <label className='text-sm font-semibold'>Location</label>
                            <LocationViewer location={activity?.Location} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={flag} onOpenChange={setFlag}>
                <DialogContent>
                    <DialogHeader>
                        <h2 className="text-lg font-bold">Are you sure you want to flag "{activity?.Name}"</h2>
                    </DialogHeader>
                    <DialogFooter>
                        <Button className='w-20' onClick={() => setFlag(false)} variant='default'>Close</Button>
                        <Button onClick={handleFlagActivity} className='w-20' variant='destructive'>
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