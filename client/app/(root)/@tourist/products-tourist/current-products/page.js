import { fetcher } from "@/lib/fetch-client";
import CurrentProducts from "./current-products";
import { getSession } from "@/lib/session";

export default async function MyProductsPage() {
  const session = await getSession();

  const userId = session?.user?.id;

  if (!userId) return <div>Error fetching user</div>;

  const products = await fetcher(`/bookings/products/current?UserId=${userId}`);

  if (!products.ok) {
    return <div>Error fetching products</div>;
  }

  const data = await products.json();

  return <CurrentProducts productBookings={data} touristId={userId} />;
}
