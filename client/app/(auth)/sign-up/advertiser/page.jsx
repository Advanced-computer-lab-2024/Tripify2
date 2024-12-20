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
import { UploadButton, UploadDropzone } from "@/lib/uploadthing"
import { useUploadThing } from "@/lib/uploadthing-hook"
import { Label } from "@/components/ui/LabelInput"
import { Checkbox } from "@/components/ui/CheckBoxInput"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import Link from "next/link"

const advertiserSignUpSchema = z.object({
    UserName: z.string().min(2, {
        message: 'UserName must be at least 2 characters long'
    }),
    Email: z.string().email({
        message: 'Invalid email address'
    }),
    Password: z.string().min(6, {
        message: 'Password must be at least 6 characters long'
    }),
    Hotline: z.string().min(5, {
        message: 'Hotline must be at least 5 characters long'
    }),
    Website: z.string().min(2, {
        message: 'Please enter a valid website'
    }),
    CompanyName: z.string().min(2, {
        message: 'Please enter a valid company name'
    }),
    CompanyDescription: z.string().min(2, {
        message: 'Please enter a valid company description'
    }),
    Document: z.string().array().min(2, {
        message: 'Please upload a valid document'
    }),
    AccpetedTerms: z.boolean().refine(value => value === true, {
        message: 'Please accept the terms and conditions'
    })
})

export default function Advertiser() {
    const router = useRouter()

    const { startUpload } = useUploadThing('advertiserDocuments')
    const [files, setFiles] = useState([])
    const [termsOpen, setTermsOpen] = useState(false)

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
    const [success, setSuccess] = useState(false);

    const form = useForm({
        resolver: zodResolver(advertiserSignUpSchema),
        defaultValues: {
            UserName: '',
            Email: '',
            Password: '',
            Hotline: '',
            Website: '',
            CompanyName: '',
            CompanyDescription: '',
            Document: [],
            AccpetedTerms: false
        },
    })

    async function onSubmit(values) {
        try {
            setLoading(true)
            setError(null)

            const uploadResult = await startUpload(files)

            const { AccpetedTerms, ...rest } = values

            const newValues = { ...rest, Document: uploadResult?.map(file => file.url) }

            await fetcher('/advertisers', {
                method: 'POST',
                body: JSON.stringify(newValues),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (res) => {
                    if (!res?.ok) {
                        const data = await res.json()
                        setError(data?.message)
                        setLoading(false)
                    }
                    else {
                        setError(null)
                        // await signIn("credentials", { username: values.UserName, password: values.Password, redirect: false })
                        setSuccess(true)
                    }
                })

            setLoading(false)

            // router.push('/')
        }
        catch (error) {
            console.log(error)
            setError(error?.message)
        }
    }

    useEffect(() => {
        form.setValue("Document", files.map(file => file.name))
    }, [files])

    return (
        <>
            <div className='flex flex-col items-center justify-start flex-1 max-h-screen gap-4 p-8 overflow-auto font-poppins'>
                <h1 className='text-xl font-semibold font-poppins'>Please fill out the following information to create your account</h1>
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
                                    <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
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
                        <h3 className='text-lg font-medium font-poppins'>Company Profile</h3>
                        <FormField
                            control={form.control}
                            name="Hotline"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Hotline</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. 19019" {...field} />
                                    </FormControl>
                                    <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Website"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. www.tripify.com" {...field} />
                                    </FormControl>
                                    <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="CompanyName"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. Tripify" {...field} />
                                    </FormControl>
                                    <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="CompanyDescription"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading} className='w-screen max-w-[340px] disabled:opacity-60' placeholder="e.g. 19019" {...field} />
                                    </FormControl>
                                    <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Document"
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
                                                <CloudUpload className="w-12 h-12 mb-2 text-gray-400" />
                                                <p className="text-sm text-center text-gray-500">
                                                    {isDragActive
                                                        ? "Drop PDF files here"
                                                        : "Drag 'n' drop PDF files here, or click to select (max 5 files)"}
                                                </p>
                                            </div>
                                            {files.length > 0 && (
                                                <ul className="mt-4 space-y-2">
                                                    {files.map((file) => (
                                                        <li key={file.name} className="flex items-center justify-between p-2 rounded bg-gray-50">
                                                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                                            <button
                                                                onClick={() => removeFile(file)}
                                                                className="text-gray-400 transition-colors hover:text-gray-600"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="AccpetedTerms"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormControl>
                                        <div className="flex items-center justify-start gap-2">
                                            <Checkbox {...field} onCheckedChange={field.onChange} id="r1" />
                                            <Label htmlFor="r1">
                                                Accept
                                                {" "}
                                                <span onClick={(e) => {
                                                    e.stopPropagation()
                                                    setTermsOpen(true)
                                                }} className='underline cursor-pointer'>
                                                    terms and conditions
                                                </span>

                                            </Label>
                                        </div>
                                    </FormControl>
                                    <FormMessage className='absolute left-0 text-xs text-red-500 -bottom-6' />
                                </FormItem>
                            )}
                        />
                        <Button className='flex items-center justify-center w-full gap-2' type="submit">
                            {loading ? <Loader2 className='animate-spin' size={16} /> : "Submit"}
                        </Button>
                        {error && (
                            <Callout className="max-w-[340px]" variant="error" title="Something went wrong">
                                {error}
                            </Callout>
                        )}
                        {success && (
                            <Callout className="max-w-[340px]" variant="success" title="Success">
                                You have successfully signed up as an advertiser!
                                {" "}
                                <Link href='/' className='underline'>
                                    Go to Home Page
                                </Link>
                            </Callout>
                        )}
                    </form>
                </Form>
            </div>
            <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
                <DialogContent>
                    <DialogHeader>Terms and Conditions</DialogHeader>
                    <div className='p-4 space-y-4'>
                        <h2 className='text-xl font-semibold'>Advertiser Terms and Conditions</h2>
                        <p className='text-gray-600'>
                            By signing up as an advertiser, you agree to the following terms and conditions:
                            <br />
                            <br />
                            1. You are responsible for ensuring that the information you provide is accurate and up-to-date.
                            <br />
                            2. You are responsible for complying with all applicable laws and regulations.
                            <br />
                            3. You are responsible for ensuring that your advertisements are not offensive, inappropriate, or harmful.
                            <br />
                            4. You are responsible for ensuring that your advertisements do not violate any intellectual property rights.
                            <br />
                            5. You are responsible for ensuring that your advertisements do not violate any copyright or trademark laws.
                            <br />
                            6. You are responsible for ensuring that your advertisements do not violate any privacy laws.
                            <br />
                            7. You are responsible for ensuring that your advertisements do not violate any terms and conditions of any third-party services or platforms.
                            <br />
                            8. You are responsible for ensuring that your advertisements do not violate any laws or regulations related to the sale, distribution, or use of drugs or other illegal substances.
                            <br />
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setTermsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}