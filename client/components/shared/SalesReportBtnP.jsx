'use client';

import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+
import { Button } from '@/components/ui/button';

export default function SalesReportBtn() {
    const router = useRouter(); // Ensure this is in a client component

    const handleRedirect = (path) => {
        if (typeof window !== 'undefined') {
            router.push(path); // Only execute on the client side
        }
    };

    return (
        <div className="flex gap-2">


        </div>
    );
}
