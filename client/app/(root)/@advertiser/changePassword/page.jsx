'use client'

import { useEffect, useState } from "react";
import {Input} from "@/components/ui/InputForm";
import {Button} from "@/components/ui/ButtonInput";
import {Callout} from "@/components/ui/Callout";
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { fetcher } from "@/lib/fetch-client";

export default function ChangePasswordPage()
{
    const session = useSession()
    const router = useRouter()

    
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    if(!session?.data?.user?.userId) return router.push('/sign-in')
        
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const changePasswordRes = await fetcher(`/users/change-password/${session.data.user.userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword })
        })

        if (!changePasswordRes.ok) {
            setError("Failed to update password");
        }

        setSuccess(true)

        setTimeout(() => {
            setLoading(false)
            setOldPassword("")
            setNewPassword("")
            router.push('/')
        }, 2500)
    }

    useEffect(() => {
        if(error) setError(null)
    }, [oldPassword, newPassword])

    return (
        <section className='font-poppins px-24 items-center justify-center w-full flex flex-col h-screen gap-12'>
            <h1 className='text-3xl font-poppins'>Change Password</h1>
            <form onSubmit={handleSubmit} className='space-y-6 max-w-[370px] w-screen flex items-center justify-center flex-col'>
                <div className='flex flex-col gap-2 w-full'>
                    <label>Old Password</label>
                    <Input disabled={loading} type='password' value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label>New Password</label>
                    <Input disabled={loading} type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <Button disabled={!oldPassword || !newPassword || loading} type='submit'>Change Password</Button>
                {error && (
                    <Callout variant="error" title="Something went wrong">
                        {error}
                    </Callout>
                )}
                {success && (
                    <Callout variant="success" title="Password changed successfully">
                        Redirecting to home page...
                    </Callout>
                )}
            </form>
        </section>
    )
}