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

const categorySchema = z.object({
    Category: z.string().min(2, {
        message: 'Category must be at least 2 characters long'
    }),
})

export default function CategoryActionBtns({ category }) 
{
    const router = useRouter()

    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            Category: category?.Category,
        },
    })

    async function onSubmit(values) {
        setLoading(true)

        console.log(values)

        await fetcher(`/categories/${category._id}`, {
            method: 'PATCH',
            body: JSON.stringify(values),
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

    const onCloseDeleteOpen = () => {
        setDeleteOpen(false)
    }

    const handleDelete = async () => {
        setLoading(true)

        await fetcher(`/categories/${category._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        setDeleteOpen(false)
        setLoading(false)
        router.refresh()
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
                <Button
                    className='w-20'
                    variant="destructive"
                    onClick={() => setDeleteOpen(true)}
                >
                    Delete
                </Button>
            </div>
            <Dialog open={edit} onOpenChange={setEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        <FormField
                            control={form.control}
                            name="Category"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. John Doe" {...field} />
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
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this category?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button disabled={loading} className='w-[5.5rem]' onClick={onCloseDeleteOpen}>Cancel</Button>
                        <Button disabled={loading} variant="destructive" className='w-[5.5rem]' onClick={handleDelete}>
                            {loading ? <Loader2 size={16} className='animate-spin' /> : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}