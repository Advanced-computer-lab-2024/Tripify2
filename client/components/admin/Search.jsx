'use client'
import {
    Search as SearchIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Search() 
{
    const searchParams = useSearchParams()
    const router = useRouter()

    const [search, setSearch] = useState(searchParams.get('search'))
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice'))
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice'))

    const handleSubmit = (e) => {
        e.preventDefault()
        let query = '/products'
        if (search) query += `?search=${search}`
        if (maxPrice) query += `&maxPrice=${maxPrice}`
        if (minPrice) query += `&minPrice=${minPrice}`

        router.push(query)
    }
    return (
        <div className="relative ml-auto flex-1 md:grow-0">
            <form onSubmit={handleSubmit}>
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </form>
        </div>
    )
}