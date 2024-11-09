import { fetcher } from "@/lib/fetch-client"
import MyHotels from "./my-hotels"

export default async function BookedHotelsPage() {
    const hotelsData = await fetcher(`/bookings/hotels`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!hotelsData?.ok) {
        return <>error</>
    }

    const hotels = await hotelsData.json()

    return <MyHotels hotelsData={hotels} />
}