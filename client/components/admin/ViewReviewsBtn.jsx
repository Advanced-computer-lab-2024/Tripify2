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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"

export default function ViewReviewsBtn({ product }) {
    const [open, setOpen] = useState(false)

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
            >
                <Star className="w-4 h-4" />
                {product.Reviews.length} Reviews
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Reviews ({product.Reviews.length})
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="space-y-6">
                            {product.Reviews.map((review, index) => (
                                <div key={index}>
                                    <div className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(review.UserId.UserName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold">
                                                        {review.UserId.UserName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDate(review.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="font-medium">
                                                        {review.Rating}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed">
                                                {review.Review}
                                            </p>
                                        </div>
                                    </div>
                                    {index < product.Reviews.length - 1 && (
                                        <Separator className="my-6" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}