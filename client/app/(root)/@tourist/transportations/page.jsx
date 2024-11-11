import { fetcher } from '@/lib/fetch-client'
import TransportationCard from './transportation-card'

export default async function TransportationPage() {
    const transportationsRes = await fetcher(`/transportations`)

    if (!transportationsRes?.ok) {
        return <>error</>
    }

    const transportations = await transportationsRes.json()

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Available Transportation</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {transportations.map((transport) => (
                    <TransportationCard key={transport._id.toString()} transport={transport} />
                ))}
            </div>
        </div>
    )
}