import { fetcher } from '@/lib/fetch-client'
import MyTransportation from './my-transportation'

export default async function MyTransportationPage() {
    const resTransportation = await fetcher(`/bookings/transportations`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!resTransportation?.ok) {
        return <>error</>
    }

    const transportations = await resTransportation.json()

    return <MyTransportation transportationData={transportations} />
}