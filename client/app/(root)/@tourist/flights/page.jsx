import { fetcher } from '@/lib/fetch-client'
import FlightCard from './flight-card'

export default async function FlightsPage() 
{
    const flightsRes = await fetcher(`/flights`)

    if (!flightsRes?.ok) {
        return <>error</>
    }

    const flights = await flightsRes.json()
  
    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Available Flights</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {flights.map((flight) => (
                    <FlightCard key={flight._id.toString()} flight={flight} />
                ))}
            </div>
        </div>
    )
}