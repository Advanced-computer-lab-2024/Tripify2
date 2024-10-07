'use client'

import { Button } from "@/components/ui/button"
import { CloudUpload, Loader2, PlusCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useState } from "react"
import { fetcher } from "@/lib/fetch-client"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useUploadThing } from "@/lib/uploadthing-hook"
import Image from "next/image"
import { useSession } from "next-auth/react"

const productSchema = z.object({
    Name: z.string().min(2, {
        message: 'Name must be at least 2 characters long'
    }),
    Image: z.string().min(2, {
        message: 'Please upload an Image'
    }),
    Price: z.number().min(2, {
        message: 'Please enter a valid Price'
    }),
    Description: z.string().min(2, {
        message: 'Please enter a valid Description'
    }),
    AvailableQuantity: z.number().min(2, {
        message: 'Please enter a valid AvailableQuantity'
    }),
})

export default function ProductActionBtns() 
{
    const router = useRouter()
    const session = useSession()

    const { startUpload } = useUploadThing('productImages')
    const [imageUploaded, setImageUploaded] = useState('')

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            Name: '',
            Image: '',
            Price: 0,
            Description: '',
            AvailableQuantity: 0,
        },
    })

    async function onSubmit(values) {
        setLoading(true)

        const uploadedImage = await startUpload([imageUploaded])

        await fetcher(`/products`, {
            method: 'POST',
            body: JSON.stringify({...values, Image: uploadedImage[0].url, Seller: session?.data?.user?.userId}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        setLoading(false)
        setOpen(false)
        router.refresh()
    }

    const onCloseOpen = () => {
        setOpen(false)
    }

    return (
        <>
            <div className='flex items-center justify-center gap-2'>
                <Button 
                    size="sm" 
                    className="h-8 gap-1"
                    onClick={() => setOpen(true)}
                >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                    </span>
                </Button> 
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Product</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        <FormField
                            control={form.control}
                            name="Name"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Image"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <div className='w-40 h-40 rounded-xl relative'>
                                            {imageUploaded ? (
                                                <Image 
                                                    src={field.value} 
                                                    alt="Image" 
                                                    className='rounded-xl max-w-full max-h-full'
                                                    width={160}
                                                    height={160} 
                                                />

                                            ) : (
                                                <div className='rounded-xl relative w-40 h-40 flex items-center justify-center'>
                                                    <CloudUpload className='text-gray-500 text-2xl' />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full cursor-pointer rounded-xl border-2 border-gray-300 opacity-0 text-gray-500 hover:opacity-100 focus:outline-none"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        const file = e.target.files[0];
                                                        const imageUrl = URL.createObjectURL(file);
                                                        setImageUploaded(imageUrl);
                                                        form.setValue("Image", imageUrl);
                                                        setImageUploaded(file);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Price"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="" {...field} onChange={(e) => form.setValue("Price", parseFloat(e.target.value.replace('-', '')))} />
                                    </FormControl>
                                    <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="Description"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. selling products to tourists" {...field} />
                                    </FormControl>
                                    <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="AvailableQuantity"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Available Quantity</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="" {...field} onChange={(e) => form.setValue("AvailableQuantity", parseFloat(e.target.value.replace('-', '')))} />
                                    </FormControl>
                                    <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" disabled={loading} className='w-[5.5rem] bg-white text-black border hover:bg-slate-200' onClick={onCloseOpen}>Cancel</Button>
                            <Button type="submit" disabled={loading} className='w-[5.5rem]'>
                                {loading ? <Loader2 size={16} className='animate-spin' /> : 'Add'}
                            </Button>
                        </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}