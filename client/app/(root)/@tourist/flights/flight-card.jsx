import { getCityName } from "@/lib/utils";
import Link from "next/link";

export default function FlightCard({ flight }) {
    return (
        <Link href={`/flights/${flight._id}`} className="block">
            <div className="p-4 transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold">{getCityName(flight.origin)} to {getCityName(flight.destination)}</div>
                    <div className="text-sm text-gray-500">
                        {new Date(flight.departureDate).toLocaleDateString()} - {new Date(flight.returnDate).toLocaleDateString()}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <span className="font-medium">{flight.origin}</span> → <span className="font-medium">{flight.destination}</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">${flight.price.total}</div>
                </div>
            </div>
        </Link>
    )
}