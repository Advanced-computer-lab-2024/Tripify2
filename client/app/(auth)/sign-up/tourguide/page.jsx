'use client'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/ButtonInput"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/InputForm"
import { fetcher } from "@/lib/fetch-client"
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, X } from 'lucide-react'
import { Callout } from "@/components/ui/Callout"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/TextAreaInput"
import { useUploadThing } from "@/lib/uploadthing-hook"

const tourguideSignUpSchema = z.object({
  UserName: z.string().min(2, {
    message: 'UserName must be at least 2 characters long'
  }),
  Email: z.string().email({
    message: 'Invalid email address'
  }),
  Password: z.string().min(6, {
    message: 'Password must be at least 6 characters long'
  }),
  MobileNumber: z.string().min(5, {
    message: 'MobileNumber must be at least 5 characters long'
  }),
  PreviousWork: z.string().optional(),
  Documents: z.string().array().min(2, {
    message: 'Please upload a valid document'
  }),
  YearsOfExperience: z.number().min(1, {
    message: 'Please enter a valid YearsOfExperience'
  }),
})

export default function Tourguide() 
{
    const router = useRouter()

    const { startUpload } = useUploadThing('tourguideDocuments')
    const [files, setFiles] = useState([])

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
        'application/pdf': ['.pdf']
        },
        maxFiles: 5,
    })

    const removeFile = (file) => {
        setFiles(files.filter(f => f !== file))
    }

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(tourguideSignUpSchema),
        defaultValues: {
            UserName: '',
            Email: '',
            Password: '',
            MobileNumber: '',
            PreviousWork: '',
            Documents: [],
            YearsOfExperience: 0
        },
    })

    async function onSubmit(values) {
        try
        {
            setLoading(true)
            setError(null)

            const uploadResult = await startUpload(files)

            const newValues = {...values, Documents: uploadResult?.map(file => file.url)}

            await fetcher('/tourguides', {
                method: 'POST',
                body: JSON.stringify(newValues),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                if(!res?.ok) {
                    const data = await res.json()
                    setError(data?.message)
                    setLoading(false)
                }
                else
                {
                    setError(null)
                    await signIn("credentials", { email: values.Email, password: values.Password })
                    router.push('/')
                }
            })

            setLoading(false)

            // router.push('/')
        }
        catch(error)
        {
            console.log(error)
            setError(error?.message)
        }
    }

    useEffect(() => {
        form.setValue("Documents", files.map(file => file.name))
    }, [files])

    return (
        <div className='flex flex-col items-center justify-start flex-1 gap-4 p-8 font-poppins max-h-screen overflow-auto'>
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
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. +20123456789" {...field} />
                                </FormControl>
                                <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="YearsOfExperience"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>Years Of Experience</FormLabel>
                                <FormControl>
                                    <Input type='number' disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. 2" {...field} onChange={(e) => form.setValue('YearsOfExperience', parseInt(e.target.value))} />
                                </FormControl>
                                <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="PreviousWork"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>Previous Work (optional)</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. a software engineer at Tripify" {...field} />
                                </FormControl>
                                <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Documents"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>Document(s)</FormLabel>
                                <FormControl>
                                    <div className="w-full max-w-[340px] mx-auto">
                                        <div
                                            {...getRootProps()}
                                            className={`
                                            p-8 border-2 border-dashed border-gray-300 rounded-lg
                                            transition-all duration-300 ease-in-out
                                            flex flex-col items-center justify-center
                                            ${isDragActive ? 'border-gray-400 scale-102' : 'hover:border-gray-400'}
                                            `}
                                        >
                                            <input {...getInputProps()} />
                                            <CloudUpload className="w-12 h-12 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 text-center">
                                            {isDragActive
                                                ? "Drop PDF files here"
                                                : "Drag 'n' drop PDF files here, or click to select (max 5 files)"}
                                            </p>
                                        </div>
                                        {files.length > 0 && (
                                            <ul className="mt-4 space-y-2">
                                            {files.map((file) => (
                                                <li key={file.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                                <button
                                                    onClick={() => removeFile(file)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage className='absolute text-red-500 text-xs -bottom-6 left-0' />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full flex items-center justify-center gap-2' type="submit">
                        {loading ? <Loader2 className='animate-spin' size={16} /> : "Submit"}
                    </Button>
                    {error && (
                        <Callout className="max-w-[340px]" variant="error" title="Something went wrong">
                            {error}
                        </Callout>
                    )}
                </form>
            </Form>
        </div>
    )
}