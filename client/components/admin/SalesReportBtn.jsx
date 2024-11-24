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
        <> <Button onClick={() => setOpen(true)}>
            All
             </Button>
             <Button onClick={() => setOpen(true)}>
            Activities
             </Button>
             <Button onClick={() => setOpen(true)}>
            Products
             </Button>
             <Button onClick={() => setOpen(true)}>
            Iteneraries
             </Button>
    
        </>
    )
}