import { fetcher } from "@/lib/fetch-client";
import MyItineraries from "@/components/ui/MyItineraries";
import Link from "next/link";

export default async function MyItinerariesPage() 
{
	const myItinerariesRes = await fetcher(`/bookings/itineraries`)

	if (!myItinerariesRes.ok) {
		return (
			<div className='flex items-center justify-center w-full h-full'>
				<h1>There was an error fetching your itineraries</h1>
				<Link href='/itineries/my-itineraries'>
					Try again
				</Link>
			</div>
		)
	}

	const myItineraries = await myItinerariesRes.json()

	console.log(myItineraries)

	return <MyItineraries itineraries={myItineraries} />
}
