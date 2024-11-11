'use client'

import { convertPrice } from "@/lib/utils"
import { useCurrencyStore } from "@/providers/CurrencyProvider"

export default function FlightPrice({ price }) {
    const { currency } = useCurrencyStore()

    return (
        <div className="text-lg font-bold text-green-600">{currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}{convertPrice(price, currency)}</div>
    )
}