'use client'

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
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

export default function ProductActionBtns({ product }) 
{
    const router = useRouter()

    const { startUpload } = useUploadThing('productImages')
    const [imageUploaded, setImageUploaded] = useState(product?.Image)

    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            Name: product?.Name,
            Image: product?.Image,
            Price: product?.Price,
            Description: product?.Description,
            AvailableQuantity: product?.AvailableQuantity,
        },
    })

    async function onSubmit(values) {
        setLoading(true)

        let uploadedImage
        if(imageUploaded !== product?.Image) uploadedImage = await startUpload([imageUploaded])
        else uploadedImage = [{ url: product?.Image }]

        await fetcher(`/products/${product._id}`, {
            method: 'PATCH',
            body: JSON.stringify({...values, Image: uploadedImage[0].url}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        setLoading(false)
        setEdit(false)
        router.refresh()
    }

    const onCloseEdit = () => {
        setEdit(false)
    }

    return (
        <>
            <div className='flex items-center justify-center gap-2'>
                <Button
                    onClick={() => setEdit(true)}
                    className='w-20'
                >
                    Edit
                </Button>
            </div>
            <Dialog open={edit} onOpenChange={setEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
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
                                            <Image 
                                                src={field.value} 
                                                alt="Image" 
                                                className='rounded-xl max-w-full max-h-full'
                                                width={160}
                                                height={160} 
                                            />
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
                            <Button type="button" disabled={loading} className='w-[5.5rem] bg-white text-black border hover:bg-slate-200' onClick={onCloseEdit}>Cancel</Button>
                            <Button type="submit" disabled={loading} className='w-[5.5rem]'>
                                {loading ? <Loader2 size={16} className='animate-spin' /> : 'Edit'}
                            </Button>
                        </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}