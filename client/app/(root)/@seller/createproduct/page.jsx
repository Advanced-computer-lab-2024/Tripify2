'use client'

import { Button } from "@/components/ui/button"
import { CloudUpload, Loader2 } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { fetcher } from "@/lib/fetch-client"
import { useUploadThing } from "@/lib/uploadthing-hook"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"

const productSchema = z.object({
  Name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  Image: z.string().min(2, {
    message: "Please upload an Image",
  }),
  Price: z.string().min(1, {
    message: "Please enter a valid Price",
  }),
  Description: z.string().min(2, {
    message: "Please enter a valid Description",
  }),
  AvailableQuantity: z.string().min(1, {
    message: "Please enter a valid Quantity",
  }),
})

export default function AddProductPage() {
  const router = useRouter()
  const session = useSession()
  const { startUpload } = useUploadThing("productImages")

  const [imageUploaded, setImageUploaded] = useState("")
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      Name: "",
      Image: "",
      Price: 0,
      Description: "",
      AvailableQuantity: 0,
    },
  })

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const uploadedImage = await startUpload([imageUploaded])
  
      // Convert string inputs to numbers
      const formattedValues = {
        ...values,
        Price: Number(values.Price),
        AvailableQuantity: Number(values.AvailableQuantity),
        Image: uploadedImage[0]?.url,
        Seller: session?.data?.user?.userId,
      }
  
      await fetcher(`/products`, {
        method: "POST",
        body: JSON.stringify(formattedValues),
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      router.push("/products")
    } catch (error) {
      console.error("Failed to add product:", error)
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-center mb-8">Add a New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product name"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                    {imageUploaded ? (
                      <Image
                        src={field.value}
                        alt="Product"
                        className="object-cover"
                        width={160}
                        height={160}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <CloudUpload className="text-gray-400 w-8 h-8" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0]
                          const imageUrl = URL.createObjectURL(file)
                          setImageUploaded(file)
                          form.setValue("Image", imageUrl)
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter product price"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="AvailableQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter available quantity"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/products")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Add Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
