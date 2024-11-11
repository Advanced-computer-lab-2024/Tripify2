'use client'
import { convertPrice } from "@/lib/utils"
import { useCurrencyStore } from "@/providers/CurrencyProvider"

export default function HotelPrice({ lowestPrice }) {
    const { currency } = useCurrencyStore()

    return (
        <div className="text-lg font-bold text-green-600">
            From {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'EGP'}{convertPrice(lowestPrice, currency)}
        </div>
    )
}