'use client'

import { LinkIcon, MailIcon } from "lucide-react"
import { useSession } from "next-auth/react"

export default function SharePlace({ place }) {
    const session = useSession()

    const handleShareEmail = () => {
        const subject = encodeURIComponent(`Check out this place: ${place.Name}`)
        const body = encodeURIComponent(`I found this amazing place and thought you might be interested:\n\n${place.Name}\n\nCheck it out here: ${window.location.href}`)
        window.location.href = `mailto:?subject=${subject}&body=${body}`
    }

    const handleCopyLink = () => {
        const dummyLink = session?.data?.user ? `http://localhost:3000/place/${place._id}` : `http://localhost:3000/places-guest/${place._id}`
        navigator.clipboard.writeText(dummyLink)
    }

    return (
        <div className="flex justify-end mb-4 space-x-4">
            <button
                onClick={handleShareEmail}
                className="flex items-center px-4 py-2 text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
                <MailIcon className="w-5 h-5 mr-2" />
                Share via Email
            </button>
            <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-2 text-gray-800 transition duration-300 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
                <LinkIcon className="w-5 h-5 mr-2" />
                Copy Link
            </button>
        </div>
    )
}