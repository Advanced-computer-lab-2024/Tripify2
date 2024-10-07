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

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onClose = () => {
        setOpen(false)
    }

    const handleDelete = async () => {
        setLoading(true)
        if(user?.UserId?.Role === "Tourist") {
            await fetcher(`/tourists/${user?._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        else if(user?.UserId?.Role === "TourGuide") {
            await fetcher(`/tourguides/${user?._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        else if(user?.UserId?.Role === "Advertiser") {
            await fetcher(`/advertisers/${user?._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        else if(user?.UserId?.Role === "Seller") {
            await fetcher(`/sellers/${user?._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        else if(user?.UserId?.Role === "TourismGovernor") {
            await fetcher(`/tourism-governors/${user?._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        setOpen(false)
        setLoading(false)
        router.refresh()
    }

    return (
        <>
            <Button
                aria-haspopup="true"
                size="icon"
                variant="ghost"
                onClick={() => setOpen(true)}
            >
                <Trash2 size={16} stroke='#A35858' />
                <span className="sr-only">Delete</span>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button disabled={loading} className='w-[5.5rem]' onClick={onClose}>Cancel</Button>
                        <Button disabled={loading} variant="destructive" className='w-[5.5rem]' onClick={handleDelete}>
                            {loading ? <Loader2 size={16} className='animate-spin' /> : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}