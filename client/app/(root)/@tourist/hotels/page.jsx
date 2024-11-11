import { fetcher } from '@/lib/fetch-client'
import Link from 'next/link'
import HotelPrice from './hotel-price'

function HotelCard({ hotel }) {
  const lowestPrice = hotel.offers.reduce((min, offer) =>
    parseFloat(offer.price.total) < min ? parseFloat(offer.price.total) : min,
    parseFloat(hotel.offers[0].price.total)
  )

  console.log(hotel)

  return (
    <Link href={`/hotels/${hotel._id}`} className="block">
      <div className="p-4 transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg">
        <h2 className="mb-2 text-xl font-semibold">{hotel.name}</h2>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">{hotel.address.countryCode}</div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < hotel.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <HotelPrice lowestPrice={lowestPrice} />
      </div>
    </Link>
  )
}

export default async function HotelsPage() {
  const hotels = await fetcher(`/hotels`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!hotels?.ok) {
    return <>error</>
  }

  const hotelsData = await hotels.json()

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Available Hotels</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hotelsData.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  )
}