'use client'

import { convertPrice } from "@/lib/utils"
import { useCurrencyStore } from "@/providers/CurrencyProvider"

export default function TransportationPrice({ pricePerDay }) {
    const { currency } = useCurrencyStore()

    return (
        <div className="mt-4">
            <h2 className="mb-2 text-xl font-semibold">Price Per Day</h2>
            <p className="text-2xl font-bold text-green-600">
                {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}
                {convertPrice(pricePerDay, currency)}
            </p>
        </div>
    )
}