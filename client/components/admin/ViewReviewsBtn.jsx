'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"

export default function ViewReviewsBtn({ product }) 
{
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                View Reviews
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reviews</DialogTitle>
                    </DialogHeader>
                    <p>{product.Reviews.map(review => review.Review)}</p>
                </DialogContent>
            </Dialog>
        </>
    )
}