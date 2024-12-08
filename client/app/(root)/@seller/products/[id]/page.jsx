"use client"; // Marking this component as a Client Component

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetch-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing-hook";

const ProductDetail = ({ params }) =>  {
  const { id } = params; // Access the dynamic product ID from the URL parameters

  const router = useRouter();

  const form= useForm();

  const { startUpload } = useUploadThing("productImages");
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState(null);
  const [sellerName, setSellerName] = useState(null); // State for storing seller name
  const [formData, setFormData] = useState({
    Name: "",
    Image: "",
    Price: -1,
    Description: "",
    AvailableQuantity: -1,
    Archived: false,
  });
  const [imageUploaded, setImageUploaded] = useState("");

  async function onSubmit(values) {
    setLoading(true);

    let uploadedImage;
    if (imageUploaded !== product?.Image)
      uploadedImage = await startUpload([imageUploaded]);
    else uploadedImage = [{ url: product?.Image }];

    await fetcher(`/products/${product._id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...values, Image: uploadedImage[0].url }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
    setEdit(false);
    router.refresh();
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch the product details
        const response = await fetcher(`/products/${id}`);
        let data = await response.json();

        setProduct(data);
        setFormData({
          Name: data.Name,
          Image: data.Image,
          Price: data.Price,
          Description: data.Description,
          AvailableQuantity: data.AvailableQuantity,
          Archived: data.Archived,
        });

        setImageUploaded(data?.Image);
        // Fetch the seller's name using the UserId from the seller object
        if (data.Seller) {
          const sellerId = data.Seller._id;
          const sellerResponse = await fetcher(`/users/${sellerId}`);
          const sellerData = await sellerResponse.json();

          if (sellerData.UserName) {
            setSellerName(sellerData.UserName);
          }
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Couldn't Fetch Details</div>;
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await fetcher(`/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response?.ok) {
        const responseError = await response.json();
        console.log(responseError);
        return <>error</>;
      }

      router.push("/");
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded m-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Product Name Field */}
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    className="w-full max-w-[340px] disabled:opacity-60"
                    placeholder="e.g. John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute left-0 text-xs text-red-500 -bottom-6" />
              </FormItem>
            )}
          />

          {/* Product Image Field */}
          <FormField
            control={form.control}
            name="Image"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="relative w-40 h-40 rounded-xl">
                    <img
                      src={field.value}
                      alt="Image"
                      className="max-w-full max-h-full rounded-xl"
                      width={160}
                      height={160}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full text-gray-500 border-2 border-gray-300 opacity-0 cursor-pointer rounded-xl hover:opacity-100 focus:outline-none"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const imageUrl = URL.createObjectURL(file);
                          form.setValue("Image", imageUrl);
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="absolute left-0 text-xs text-red-500 -bottom-6" />
              </FormItem>
            )}
          />

          {/* Product Price Field */}
          <FormField
            control={form.control}
            name="Price"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={loading}
                    className="w-full max-w-[340px] disabled:opacity-60"
                    placeholder=""
                    {...field}
                    onChange={(e) =>
                      form.setValue(
                        "Price",
                        Math.max(0, parseFloat(e.target.value))
                      )
                    }
                  />
                </FormControl>
                <FormMessage className="absolute left-0 text-xs text-red-500 -bottom-6" />
              </FormItem>
            )}
          />

          {/* Product Description Field */}
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    className="w-full max-w-[340px] disabled:opacity-60"
                    placeholder="e.g. selling products to tourists"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute left-0 text-xs text-red-500 -bottom-6" />
              </FormItem>
            )}
          />

          {/* Available Quantity Field */}
          <FormField
            control={form.control}
            name="AvailableQuantity"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Available Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={loading}
                    className="w-full max-w-[340px] disabled:opacity-60"
                    placeholder=""
                    {...field}
                    onChange={(e) =>
                      form.setValue(
                        "AvailableQuantity",
                        Math.max(0, parseFloat(e.target.value))
                      )
                    }
                  />
                </FormControl>
                <FormMessage className="absolute left-0 text-xs text-red-500 -bottom-6" />
              </FormItem>
            )}
          />

          {/* Archived Checkbox Field */}
          <FormField
            control={form.control}
            name="Archived"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="archived"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Archived
                    </label>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="archived"
                    />
                  </div>
                </FormControl>
                <FormMessage className="absolute left-0 text-xs text-red-500 -bottom-6" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-center">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ProductDetail;