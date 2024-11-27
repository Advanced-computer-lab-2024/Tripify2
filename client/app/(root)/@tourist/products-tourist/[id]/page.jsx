import { fetcher } from "@/lib/fetch-client";
import ProductPage from "./product";
import { getSession } from "@/lib/session";

export default async function ProductDetail({ params }) {
    const { id } = params;
    const session = await getSession();

    const res = await fetcher(`/tourists/${session?.user?.id}`).catch((e) =>
    console.error("Error fetching tourist:", e)
    );

    if (!res.ok) {
    const resError = await res.json();
    console.log(resError);
    return <>error</>;
    }

    const tourist = await res.json();
    let cart = tourist.Cart
      

    const product = await fetcher(`/products/${id}`);

    if (!product.ok) {
        return <div>Error fetching product</div>;
    }

    const data = await product.json();

    return <ProductPage product={data} cart={cart}/>;
}