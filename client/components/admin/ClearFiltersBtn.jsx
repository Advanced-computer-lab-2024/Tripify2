'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ClearFiltersBtn() {
    const router = useRouter()

    const handleClick = () => {
        router.push('/products')
    }

    return (
        <Button variant='destructive' className="clear-filters-btn" onClick={handleClick}>
            Clear Filters
        </Button>
    )
}