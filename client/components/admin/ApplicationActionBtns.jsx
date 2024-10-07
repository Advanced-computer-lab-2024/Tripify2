'use client'

import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useState } from "react"
import { fetcher } from "@/lib/fetch-client"
import { useRouter } from "next/navigation"

export default function DeleteUserBtn({ user }) 
{
    const router = useRouter()

    const [reject, setReject] = useState(false)
    const [loading, setLoading] = useState(false)
    const [accept, setAccept] = useState(false)

    const onCloseReject = () => {
        setReject(false)
    }

    const onCloseAccept = () => {
        setAccept(false)
    }

    const handleReject = async () => {
        setLoading(true)
        if(user?.UserId?.Role === "TourGuide") {
            await fetcher(`/tourguides/reject/${user?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        else if(user?.UserId?.Role === "Advertiser") {
            await fetcher(`/advertisers/reject/${user?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        else if(user?.UserId?.Role === "Seller") {
            await fetcher(`/sellers/reject/${user?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        setReject(false)
        setLoading(false)
        router.refresh()
    }

    const handleAccept = async () => {
        setLoading(true)
        if(user?.UserId?.Role === "TourGuide") {
            await fetcher(`/tourguides/accept/${user?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        else if(user?.UserId?.Role === "Advertiser") {
            await fetcher(`/advertisers/accept/${user?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }        
        else if(user?.UserId?.Role === "Seller") {
            await fetcher(`/sellers/accept/${user?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        setAccept(false)
        setLoading(false)
        router.refresh()
    }

    return (
        <>
            <div className='flex items-center justify-center gap-2'>
                <Button
                    variant="destructive"
                    onClick={() => setReject(true)}
                    className='w-20'
                >
                    Reject
                </Button>
                <Button
                    className='bg-green-600 w-20'
                    onClick={() => setAccept(true)}
                >
                    Accept
                </Button>
            </div>
            <Dialog open={reject} onOpenChange={setReject}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject this user?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button disabled={loading} className='w-[5.5rem]' onClick={onCloseReject}>Cancel</Button>
                        <Button disabled={loading} variant="destructive" className='w-[5.5rem]' onClick={handleReject}>
                            {loading ? <Loader2 size={16} className='animate-spin' /> : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={accept} onOpenChange={setAccept}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Accept User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to accept this user?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button disabled={loading} className='w-[5.5rem]' onClick={onCloseAccept}>Cancel</Button>
                        <Button disabled={loading} className='w-[5.5rem] bg-green-600' onClick={handleAccept}>
                            {loading ? <Loader2 size={16} className='animate-spin' /> : 'Accept'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}