import { fetcher } from "@/lib/fetch-client";
import MyProducts from "./my-products";
import { getSession } from "@/lib/session";

export default async function MyProductsPage() {
  const session = await getSession();

  const userId = session?.user?.userId;

  if (!userId) return <div>Error fetching user</div>;

  const products = await fetcher(`/bookings/products?UserId=${userId}`);

  if (!products.ok) {
    return <div>Error fetching products</div>;
  }

  const data = await products.json();

  const updatedData = await Promise.all(
    data.map(async (booking) => {
      if (booking.Status === "Pending") {
        try {
          const updateQuantityResponse = await fetcher(
            `/bookings/products/updateQuantityAndStatus`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: booking._id }),
            }
          );

          if (!updateQuantityResponse.ok) {
            console.error(
              `Failed to update quantities and status for booking ${booking._id}`
            );
            return booking;
          }

          const updatedBooking = await updateQuantityResponse();
          return updatedBooking;
        } catch (error) {
          console.error(`Error processing booking ${booking._id}:`, error);
          return booking;
        }
      }
      return booking;
    })
  );

  return <MyProducts productBookings={updatedData} user={session?.user} />;
}
