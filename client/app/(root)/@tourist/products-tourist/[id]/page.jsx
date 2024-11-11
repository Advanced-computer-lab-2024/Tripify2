import { fetcher } from "@/lib/fetch-client";
import ProductPage from "./product";

export default async function ProductDetail({ params }) {
    const { id } = params;

    const product = await fetcher(`/products/${id}`);

    if (!product.ok) {
        return <div>Error fetching product</div>;
    }

    const data = await product.json();

    return <ProductPage product={data} />;
}