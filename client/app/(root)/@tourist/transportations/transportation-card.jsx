import Link from "next/link";
import TransportationPrice from "./transportation-price";

export default function TransportationCard({ transport }) {
    return (
        <Link href={`/transportations/${transport._id}`} className="block">
            <div className="p-4 transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold">{transport.name}</div>
                    <div className="px-2 py-1 text-sm text-white bg-blue-500 rounded">
                        {transport.type}
                    </div>
                </div>
                <div className="mb-2">
                    <p className="text-sm text-gray-600">{transport.description}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="text-sm">
                        <span className="font-medium">Capacity: {transport.capacity} persons</span>
                    </div>
                    <TransportationPrice pricePerDay={transport.pricePerDay} />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    <span className={transport.availability ? "text-green-500" : "text-red-500"}>
                        {transport.availability ? "Available" : "Currently Booked"}
                    </span>
                </div>
            </div>
        </Link>
    )
}