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
                View Statistics
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Statistics</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                                Total Sales
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                                {product.TotalSales}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                                Available Quantity
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                                {product.AvailableQuantity}
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}