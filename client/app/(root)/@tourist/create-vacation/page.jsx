import { fetcher } from "@/lib/fetch-client"
import CreateVacation from "./create-vacation"

export default async function CreateVacationPage() 
{
    const tagsRes = await fetcher(`/tags`)
    const categoriesRes = await fetcher(`/categories`)
    const flightsRes = await fetcher(`/flights`)
    const placesRes = await fetcher(`/places`)

    if (!tagsRes?.ok || !categoriesRes?.ok || !flightsRes?.ok || !placesRes?.ok) {
        return <>error</>
    }

    const tags = await tagsRes.json()
    const categories = await categoriesRes.json()
    const flights = await flightsRes.json()
    const places = await placesRes.json()

    return <CreateVacation tags={tags} categories={categories} flights={flights} places={places} />
}