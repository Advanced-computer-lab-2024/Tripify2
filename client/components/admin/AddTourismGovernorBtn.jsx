'use client'

import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle, Trash2 } from "lucide-react"
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
import { Callout } from "../ui/Callout"

const newTourismGovernorSchema = z.object({
    UserName: z.string().min(2, {
        message: 'UserName must be at least 2 characters long'
    }),
    Email: z.string().email({
        message: 'Invalid email address'
    }),
    Password: z.string().min(6, {
        message: 'Password must be at least 6 characters long'
    }),
})

export default function AddTourismGovernorBtn() 
{
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const form = useForm({
        resolver: zodResolver(newTourismGovernorSchema),
        defaultValues: {
            UserName: '',
            Email: '',
            Password: '',
        },
    })

    async function onSubmit(values) {
        setLoading(true)

        console.log(values)

        const res = await fetcher('/tourism-governors', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(!res?.ok) {
            const data = await res.json()
            setError(data?.message)
            setLoading(false)
        }
        else
        {
            setError(null)
            setLoading(false)
            setOpen(false)
            router.refresh()
        }
    }

    const onClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Button 
                size="sm" 
                className="h-8 gap-1"
                onClick={() => setOpen(true)}
            >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Tourism Governor
                </span>
            </Button> 
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Tourism Governor</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                            <FormField
                                control={form.control}
                                name="UserName"
                                render={({ field }) => (
                                    <FormItem className='relative'>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="Email"
                                render={({ field }) => (
                                    <FormItem className='relative'>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. johndoe@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="Password"
                                render={({ field }) => (
                                    <FormItem className='relative'>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} type="password" className='w-screen max-w-[340px] disabled:opacity-60' placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />                                        
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <Callout variant="error" title="Something went wrong">
                                    {error}
                                </Callout>
                            )}
                            <DialogFooter>
                                <Button type="button" disabled={loading} className='w-[5.5rem]' onClick={onClose}>Cancel</Button>
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