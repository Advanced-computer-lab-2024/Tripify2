import VacationResults from './vacation-results'
import { fetcher } from '@/lib/fetch-client'
import { getCityName, getCountryFromCoordinates, getCountryName } from '@/lib/utils'

export default async function VacationResultsPage({ searchParams }) {
    console.log(searchParams)

    const origin = searchParams['origin']
    const destination = searchParams['destination']
    const tags = searchParams['tags']?.split('-') || []
    const categories = searchParams['categories']?.split('-') || []
    const startDate = searchParams['startDate'] || ''

    console.log(origin)
    console.log(destination)
    console.log(tags)
    console.log(categories)
    console.log(startDate)

    const [flightsData, hotelsData, itinerariesData, activitiesData] = await Promise.all([
        fetcher(`/flights?origin=${origin}&destination=${destination}&startDate=${startDate}`),
        fetcher(`/hotels`),
        fetcher(`/itineraries?&categories=${categories.join('-')}&tags=${tags.join('-')}`),
        fetcher(`/activities?&categories=${categories.join('-')}&tags=${tags.join('-')}`)
    ])

    if (!flightsData?.ok || !hotelsData?.ok || !itinerariesData?.ok || !activitiesData?.ok) {
        const flightsError = await flightsData.json()
        const hotelsError = await hotelsData.json()
        const itinerariesError = await itinerariesData.json()
        const activitiesError = await activitiesData.json()

        return <div className="flex items-center justify-center h-screen">{flightsError.msg || hotelsError.msg || itinerariesError.msg || activitiesError.msg}</div>
    }

    const flights = await flightsData.json()
    const hotels = await hotelsData.json()
    const itineraries = await itinerariesData.json()
    const activities = await activitiesData.json()

    const destinationCity = getCityName(destination)
    const destinationCountry = getCountryName(destinationCity)

    console.log(destinationCity)
    console.log(destinationCountry)


    const hotelsFiltered = hotels.filter(hotel => {
        const hotelCountry = getCountryFromCoordinates(hotel.geoCode.latitude, hotel.geoCode.longitude)
        // console.log(hotelCountry)
        return hotelCountry.countryName === destinationCountry
    })

    // console.log(hotelsFiltered)

    const activitiesFiltered = activities.filter(activity => {
        const activityCountry = getCountryFromCoordinates(activity.Location.coordinates[0], activity.Location.coordinates[1])
        // console.log(activityCountry)
        return activityCountry.countryName === destinationCountry
    })

    // console.log(activitiesFiltered)

    const itinerariesFiltered = itineraries.filter(itinerary => {
        const itineraryCountry = getCountryFromCoordinates(itinerary.Location.coordinates[0], itinerary.Location.coordinates[1])
        // console.log(itineraryCountry)
        return itineraryCountry.countryName === destinationCountry
    })
    // console.log(itinerariesFiltered)

    return <VacationResults flights={flights} hotels={hotelsFiltered} itineraries={itinerariesFiltered} activities={activitiesFiltered} />
}