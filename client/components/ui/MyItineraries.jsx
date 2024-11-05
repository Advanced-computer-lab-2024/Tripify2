'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Users2Icon } from 'lucide-react'
import Link from "next/link"

const ItineraryCard = ({ itinerary }) => (
  <Card className="w-full">
    <CardHeader className="relative p-0">
      <img src={itinerary.ItineraryId.Image} alt={itinerary.ItineraryId.Name} className="object-cover w-full h-32 rounded-t-lg" />
      <Badge className="absolute top-2 right-2" variant={itinerary.status === 'completed' ? 'secondary' : 'default'}>
        {itinerary.status === 'completed' ? 'Completed' : itinerary.status === 'upcoming' ? 'Upcoming' : 'Running'}
      </Badge>
    </CardHeader>
    <CardContent className="pt-4">
      <CardTitle className="mb-2 text-lg">{itinerary.ItineraryId.Name}</CardTitle>
      {/* <CardDescription className="flex items-center mb-1">
        <MapPinIcon className="w-4 h-4 mr-1" />
        {itinerary.ItineraryId.location}
      </CardDescription> */}
      <CardDescription className="flex items-center mb-1">
        <CalendarIcon className="w-4 h-4 mr-1" />
        {new Date(itinerary.ItineraryStartDate).toLocaleDateString()} - {new Date(itinerary.ItineraryEndDate).toLocaleDateString()}
      </CardDescription>
      <CardDescription className="flex items-center">
        <Users2Icon className="w-4 h-4 mr-1" />
        {itinerary.Participants} participant(s)
      </CardDescription>
    </CardContent>
    <CardFooter>
        <Link href={`/itineraries/my-itineraries/${itinerary._id}`} className="w-full">
            <Button variant="outline" className="w-full">
                View Details
            </Button>
        </Link>
    </CardFooter>
  </Card>
)

export default function ItinerariesOverview({ itineraries }) 
{
    const upcomingItineraries = itineraries.filter(i => new Date(i.ItineraryStartDate) > new Date()).map(i => ({ ...i, status: 'upcoming' }))
    const completedItineraries = itineraries.filter(i => new Date(i.ItineraryEndDate) < new Date()).map(i => ({ ...i, status: 'completed' }))
    const runningItineraries = itineraries.filter(i => new Date(i.ItineraryStartDate) <= new Date() && new Date(i.ItineraryEndDate) >= new Date()).map(i => ({ ...i, status: 'running' }))
    const allItineraries = [...upcomingItineraries, ...completedItineraries, ...runningItineraries]

    console.log(itineraries)
    console.log(runningItineraries)

    return (
        <div className="container p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">My Itineraries</h1>
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="running">Running</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allItineraries.map((itinerary, index) => (
                            <ItineraryCard key={index} itinerary={itinerary} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="upcoming">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingItineraries.map(itinerary => (
                            <ItineraryCard key={itinerary.ItineraryId._id} itinerary={itinerary} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="running">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {runningItineraries.map(itinerary => (
                            <ItineraryCard key={itinerary.ItineraryId._id} itinerary={itinerary} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="completed">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {completedItineraries.map(itinerary => (
                            <ItineraryCard key={itinerary.ItineraryId._id} itinerary={itinerary} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}