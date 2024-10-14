'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { EyeIcon } from "lucide-react"
import { useState } from "react"

export default function ViewDocuments({ documents })
{
    const [open, setOpen] = useState(false)

    return (
        <>
            <div onClick={() => setOpen(true)} className="flex gap-2 items-center cursor-pointer">
                <EyeIcon />
                View All
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='min-w-[900px] min-h-[720px] flex items-center justify-center'>
                <Carousel className="max-w-[700px]">
                    <CarouselContent className=''>
                        {documents.map((doc, index) => (
                        <CarouselItem key={index} className='flex items-center justify-center'>
                            <iframe src={doc} className='w-[600px] h-[700px]' />
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                </DialogContent>
            </Dialog>
        </>
    )
}