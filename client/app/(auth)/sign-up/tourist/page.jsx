'use client'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/ButtonInput.tsx"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/InputForm"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/SelectInput"
import { countries } from "@/constants"
import { DatePicker } from "@/components/ui/DOBPicker.tsx"
import { fetcher } from "@/lib/fetch-client"
import { useEffect, useState } from "react"
import { Callout } from "@/components/ui/Callout"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
// import { DatePicker } from "@/components/ui/DatePickerInput"

const touristSignUpSchema = z.object({
  UserName: z.string().min(2, {
    message: 'UserName must be at least 2 characters long'
  }),
  Email: z.string().email({
    message: 'Invalid email address'
  }),
  Password: z.string().min(6, {
    message: 'Password must be at least 6 characters long'
  }),
  MobileNumber: z.string().min(10, {
    message: 'Mobile number must be at least 10 characters long'
  }),
  Nationality: z.string().min(2, {
    message: 'Please select your nationality'
  }),
  DOB: z.string({
    message: 'Please select your date of birth'
  }),
  Occupation: z.string().min(2, {
    message: 'Please select your occupation'
  }),
  Wallet: z.string().min(2, {
    message: 'Wallet must be at least 2 characters long'
  }),
})

export default function Tourist() 
{
    const router = useRouter()

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());

    const form = useForm({
        resolver: zodResolver(touristSignUpSchema),
        defaultValues: {
            UserName: '',
            Email: '',
            Password: '',
            MobileNumber: '',
            Nationality: '',
            DOB: '',
            Occupation: '',
            Wallet: '0.00',
        },
    })

    async function onSubmit(values) {
        try
        {
            setLoading(true)
            setError(null)

            await fetcher('/tourists', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            await signIn("credentials", { email: values.Email, password: values.Password })

            setLoading(false)

            router.push('/')
        }
        catch(error)
        {
            console.log(error)
            setError(error?.message)
        }
    }

    useEffect(() => {
        console.log(date)
        form.setValue("DOB", date.toISOString())
    }, [date])

    return (
        <div className='flex flex-col items-center justify-center flex-1 gap-4 p-8 font-poppins max-h-screen overflow-auto'>
            <h1 className='font-semibold text-xl font-poppins'>Please fill out the following information to create your account</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <FormField
                        control={form.control}
                        name="MobileNumber"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>MobileNumber</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. +20123456789" {...field} />
                                </FormControl>
                                <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Nationality"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>Nationality</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange} className='w-screen max-w-[340px] disabled:opacity-60' {...field}>
                                        <SelectTrigger id="size" className="mt-2">
                                            <SelectValue placeholder="Nationality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="DOB"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>DOB</FormLabel>
                                <FormControl>
                                    <DatePicker toDate={new Date()} className='w-screen max-w-[340px] disabled:opacity-60 outlineNone' value={date} onChange={setDate} />
                                </FormControl>
                                <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Occupation"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>Occupation</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange} className='w-screen font-poppins max-w-[340px] disabled:opacity-60' {...field}>
                                        <SelectTrigger id="size" className="mt-2">
                                            <SelectValue placeholder="Occupation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Student", "Developer", "Other"].map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Wallet"
                        render={({ field }) => (
                            <FormItem className='relative'>
                            </FormItem>
                        )}
                    />
                    <Button className='w-full flex items-center justify-center gap-2' type="submit">
                        {loading ? <Loader2 className='animate-spin' size={16} /> : "Submit"}
                    </Button>
                    {error && (
                        <Callout variant="error" title="Something went wrong">
                            {error}
                        </Callout>
                    )}
                </form>
            </Form>
        </div>
    )
}