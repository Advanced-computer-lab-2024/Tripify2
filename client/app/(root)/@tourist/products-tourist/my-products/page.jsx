import { fetcher } from "@/lib/fetch-client";
import MyProducts from "./my-products";
import { getSession } from "@/lib/session";

export default async function MyProductsPage() 
{
    const products = await fetcher('/bookings/products')

    if (!products.ok) 
    {
        return <div>Error fetching products</div>;
    }

    const session = await getSession()

    const data = await products.json();

    return <MyProducts productBookings={data} user={session?.user} />;
}