import { fetcher } from '@/lib/fetch-client'
import MyFlights from './my-flights'

export default async function MyFlightsPage() {
  const resFlight = await fetcher(`/bookings/flights`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!resFlight?.ok) {
    return <>error</>
  }

  const flights = await resFlight.json()

  return <MyFlights flightsData={flights} />
}