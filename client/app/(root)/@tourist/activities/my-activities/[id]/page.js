'use client'
import { useState, useEffect } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, MapPinIcon, Users2Icon, StarIcon, DollarSignIcon, LanguagesIcon, UserSquareIcon } from 'lucide-react'
import Confetti from 'react-confetti'
import { useCurrencyStore } from '@/providers/CurrencyProvider'
import { fetcher } from '@/lib/fetch-client'
import { Callout } from '@/components/ui/Callout'
import { cn } from '@/lib/utils'
import { Separator } from "@/components/ui/separator"
import { revalidate } from '@/lib/server'
import Link from 'next/link'

// Mock function to fetch activity data
const fetchActivityData = async (id) => {
  // In a real application, this would be an API call
  const response = await fetcher(`/bookings/activities/${id}`)

  if (!response?.ok) {
    return null
  }

  return await response.json()
}

const getActivityStatus = (startDate) => {
  const now = new Date()
  const start = new Date(startDate)

  if (now < start) return 'upcoming'
  return 'completed'
}

const generateLink = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    setError('Please enter valid coordinates.');
    setLink('');
    return;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    setError('Coordinates are out of range.');
    setLink('');
    return;
  }

  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return url;
}

const ActivityDetails = ({ activity }) => {
  const { currency } = useCurrencyStore()

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>{new Date(activity.ActivityDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <Link href={generateLink(activity.ActivityId.Location.coordinates[0], activity.ActivityId.Location.coordinates[1])}>{generateLink(activity.ActivityId.Location.coordinates[0], activity.ActivityId.Location.coordinates[1])}</Link>
            </div>
            <div className="flex items-center">
              <Users2Icon className="w-5 h-5 mr-2" />
              <span>{activity.Participants} participants</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <UserSquareIcon className="w-5 h-5 mr-2" />
              <span>{activity.ActivityId.AdvertiserId.UserId.UserName}</span>
            </div>
            <div className="flex items-center">
              <DollarSignIcon className="w-5 h-5 mr-2" />
              {currency === 'USD' ? '$ ' : currency === 'EUR' ? '€ ' : 'EGP '}
              <span>{activity.TotalPaid / 100}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activity.ActivityId.Activities.map((activity, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{activity.type}</span>
                  <Badge>{activity.duration} minutes</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card> */}
    </div>
  )
}

const RatingsAndComments = ({ activity, setRefetch }) => {
  const router = useRouter()
  const userReview = activity.ActivityId.Reviews.find(review => review.UserId._id === activity.UserId)
  const [rating, setRating] = useState(userReview?.Rating ?? 0)
  const [comment, setComment] = useState(userReview?.Review ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pathname = usePathname()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    const res = await fetcher(`/reviews/activities/${activity.ActivityId._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Rating: rating, Review: comment }),
    })

    if (!res.ok) {
      setLoading(false)
      setError('Failed to submit review')
      return
    }

    setLoading(false)
    await revalidate(pathname)
    setRefetch(prev => !prev)
    router.refresh()
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Ratings and Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Overall Rating</h3>
          <div className="flex items-center">
            <StarIcon className="w-6 h-6 mr-2 text-yellow-400" />
            <span className="text-xl font-bold">{activity.ActivityId.Rating}/5</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rating" className="block mb-1 text-sm font-medium text-gray-700">Your Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={cn(`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`, !userReview && 'cursor-pointer')}
                  onClick={() => !userReview && setRating(star)}
                />
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block mb-1 text-sm font-medium text-gray-700">Your Comment</label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              disabled={userReview}
            />
          </div>
          {!userReview && <Button disabled={loading} type="submit">{loading ? "Submitting..." : "Submit Review"}</Button>}
        </form>
        {error && (
          <Callout variant="error" title="Something went wrong" className='mt-2'>
            {error}
          </Callout>
        )}
        <Separator className="my-6" />
        <div>
          <h3 className="mb-4 text-lg font-semibold">User Reviews</h3>
          <div className="space-y-4">
            {activity.ActivityId.Reviews.map((review, index) => (
              <div key={index} className="pb-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.UserId.UserName}</span>
                  <div className="flex items-center">
                    <StarIcon className="w-5 h-5 mr-1 text-yellow-400" />
                    <span>{review.Rating}/5</span>
                  </div>
                </div>
                <p className="text-gray-600">{review.Review}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ActivityPage() {
  const router = useRouter()

  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refetch, setRefetch] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchActivityData(id).then(data => {
        if (data.Status === 'Cancelled') return router.push('/activities/my-activities')
        setActivity(data)
        setLoading(false)
      })
    }
  }, [id, refetch])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!activity) {
    return <div className="flex items-center justify-center h-screen">Activity not found</div>
  }

  const status = getActivityStatus(activity.ActivityDate)

  console.log(status)

  function isWithin48Hours(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);

    const diffTime = target.getTime() - now.getTime();

    const diffHours = diffTime / (1000 * 60 * 60);

    return diffHours >= 0 && diffHours <= 48;
  }

  const handleCancelBooking = async () => {
    setLoading(true)

    const res = await fetcher(`/bookings/activities/cancel-booking/${activity._id}`, {
      method: 'POST',
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.msg)
      return
    }
    else {
      router.push('/activities/my-activities')
    }
  }

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">{activity.ActivityId.Name}</h1>
      <div className="mb-6">
        <img src={activity.ActivityId.Image} alt={activity.ActivityId.Name} className="object-cover w-full h-64 rounded-lg" />
      </div>

      <ActivityDetails activity={activity} setRefetch={setRefetch} />

      {status === 'upcoming' && (
        <div className='flex items-center justify-end w-full mt-4'>
          <Button onClick={handleCancelBooking} disabled={isWithin48Hours(activity.ActivityDate) || loading} variant='destructive' className='w-full md:w-auto'>{loading ? "Cancelling..." : "Cancel Booking"}</Button>
        </div>
      )}
      {error && (
        <Callout variant="error" title="Something went wrong" className='mt-2'>
          {error}
        </Callout>
      )}

      {status === 'completed' && <RatingsAndComments activity={activity} setRefetch={setRefetch} />}
    </div>
  )
}