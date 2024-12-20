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
import { Callout } from "@/components/ui/Callout"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

const signInSchema = z.object({
    UserName: z.string().min(2, {
        message: 'Invalid username'
    }),
    Password: z.string().min(6, {
        message: 'Password must be at least 6 characters long'
    }),
})

export default function SignIn() 
{
    const router = useRouter()

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            UserName: '',
            Password: '',
        },
    })

    async function onSubmit(values) {
        try
        {
            setLoading(true)
            setError(null)

            const signInResult = await signIn("credentials", { username: values.UserName, password: values.Password, redirect: false  })
            console.log(signInResult)
            if (signInResult?.error)
            {
                setError(signInResult?.error)
            }
            else router.push('/')

            setLoading(false)
        }
        catch(error)
        {
            console.log(error)
            setError(error?.message)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center flex-1 gap-24 p-8'>
            <h1 className='text-4xl font-semibold font-poppins'>Welcome Back!</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="UserName"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>UserName</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. johndoe" {...field} />
                                </FormControl>
                                <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
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
                                <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end text-sm">
                        <Link
                            href="/forgot-password" 
                            className="text-blue-500 transition-colors hover:text-blue-600"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Button className='flex items-center justify-center w-full gap-2' type="submit">
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