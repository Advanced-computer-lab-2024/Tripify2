'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { fetcher } from "@/lib/fetch-client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function UserActions({ user }) {
    const router = useRouter()
    const [deleteOpen, setDeleteOpen] = useState(false)

    const handleDelete = async () => {
        try {
            const response = await fetcher(`/users/${user._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (!response?.ok) {
                return <>error</>
            }

            router.refresh()
        } catch (error) {
            console.error('Error deleting user:', error)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                    Delete
                </Button>
            </div>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>Are you sure you want to delete this user?</DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}