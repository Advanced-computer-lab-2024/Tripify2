'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button'
import { Loader2, SortDescIcon, SortAscIcon} from "lucide-react"

export default function SortRatingBtn() 
{
    const router = useRouter()
    const searchParams = useSearchParams()

    const rating = searchParams.get('rating')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const handleClick = () => {
        let query = '/products?'
        if (search) query += `search=${search}&`
        if (minPrice || maxPrice) {
            query += `minPrice=${minPrice}&maxPrice=${maxPrice}&`
        }
        query += `rating=${rating === 'asc' ? 'desc' : 'asc'}`

        if(query.endsWith("?")) query = '/products'

        router.push(query)
    }

    return (
        <Button variant='' className="flex items-center justify-center gap-2" onClick={handleClick}>
            {rating ==='desc' ? <SortDescIcon className="h-3.5 w-3.5" /> : rating === 'asc' ? <SortAscIcon className="h-3.5 w-3.5" /> : null}
            Rating
        </Button>
    )
}