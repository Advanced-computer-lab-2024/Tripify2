import { notFound } from 'next/navigation'
import { fetcher } from '@/lib/fetch-client'
import TransportationPrice from './transportation-price'
import BookingForm from './booking-form'
import Image from 'next/image'

export default async function TransportationDetailsPage({ params }) {
    const transportData = await fetcher(`/transportations/${params.id}`)

    if (!transportData.ok) {
        notFound()
    }

    const transport = await transportData.json()

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">{transport.name}</h1>
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <h2 className="mb-2 text-xl font-semibold">Vehicle Details</h2>
                            <p className="text-gray-600">{transport.description}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Type</h3>
                            <p className="text-gray-600">{transport.type}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Capacity</h3>
                            <p className="text-gray-600">{transport.capacity} persons</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Location</h3>
                            <p className="text-gray-600">{transport.location}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Features</h3>
                            <ul className="mt-1 ml-4 space-y-1 list-disc">
                                {transport.features.map((feature, index) => (
                                    <li key={index} className="text-gray-600">{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        {transport.images?.length > 0 && (
                            <div className="w-full h-64 overflow-hidden rounded-lg">
                                <Image
                                    src={transport.images[0]}
                                    alt={transport.name}
                                    className="object-cover w-full h-full"
                                    width={500}
                                    height={300}
                                />
                            </div>
                        )}
                        <TransportationPrice pricePerDay={transport.pricePerDay} />
                    </div>
                </div>
            </div>
            <BookingForm transportId={transport._id} isAvailable={transport.availability} />
        </div>
    )
}