'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, Users2Icon } from 'lucide-react'
import Link from "next/link"

const ActivityCard = ({ activity }) => (
  <Card className="w-full">
    <CardHeader className="relative p-0">
      <img src={activity?.ActivityId?.Image} alt={activity?.ActivityId?.Name} className="object-cover w-full h-32 rounded-t-lg" />
      <Badge className="absolute top-2 right-2" variant={activity.status === 'completed' ? 'secondary' : 'default'}>
        {activity.status === 'completed' ? 'Completed' : 'Upcoming'}
      </Badge>
    </CardHeader>
    <CardContent className="pt-4">
      <CardTitle className="mb-2 text-lg">{activity?.ActivityId?.Name}</CardTitle>
      {/* <CardDescription className="flex items-center mb-1">
        <MapPinIcon className="w-4 h-4 mr-1" />
        {activity.ActivityId.location}
      </CardDescription> */}
      <CardDescription className="flex items-center mb-1">
        <CalendarIcon className="w-4 h-4 mr-1" />
        {new Date(activity.ActivityDate).toLocaleDateString()}
      </CardDescription>
      <CardDescription className="flex items-center">
        <Users2Icon className="w-4 h-4 mr-1" />
        {activity.Participants} participant(s)
      </CardDescription>
    </CardContent>
    <CardFooter>
      <Link href={`/activities/my-activities/${activity._id}`} className="w-full">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </Link>
    </CardFooter>
  </Card>
)

export default function ActivitiesOverview({ activities }) {
  const upcomingActivities = activities.filter(i => new Date(i.ActivityDate) > new Date()).map(i => ({ ...i, status: 'upcoming' }))
  const completedActivities = activities.filter(i => new Date(i.ActivityDate) < new Date()).map(i => ({ ...i, status: 'completed' }))
  const allActivities = [...upcomingActivities, ...completedActivities]

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Activities</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allActivities.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingActivities.map(activity => (
              <ActivityCard key={activity.ActivityId?._id} activity={activity} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedActivities.map(activity => (
              <ActivityCard key={activity.ActivityId?._id} activity={activity} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}