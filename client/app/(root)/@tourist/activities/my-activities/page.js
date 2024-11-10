import { fetcher } from "@/lib/fetch-client";
import MyActivities from "@/components/ui/MyActivities";
import Link from "next/link";

export default async function MyActivitiesPage() 
{
	const myActivitiesRes = await fetcher(`/bookings/activities`)

	if (!myActivitiesRes.ok) {
		return (
			<div className='flex items-center justify-center w-full h-full'>
				<h1>There was an error fetching your activities</h1>
				<Link href='/itineries/my-activities'>
					Try again
				</Link>
			</div>
		)
	}

	const myActivities = await myActivitiesRes.json()

	console.log(myActivities)

	return <MyActivities activities={myActivities} />
}
