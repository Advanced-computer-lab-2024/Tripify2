'use client'
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { v4 as uuid } from "uuid"
import * as Frigade from "@frigade/react"

export default function FrigadeProvider({ children }) {
    const session = useSession()

    const userId = useMemo(() => {
        if (session?.user) {
            return session.user.id
        }
        else {
            if (localStorage.getItem('userId')) {
                return localStorage.getItem('userId')
            }
            else {
                const userId = uuid()
                localStorage.setItem('userId', userId)
                return userId
            }
        }
    }, [session, localStorage])

    const flowId = useMemo(() => {
        if (session?.user) {
            return 'flow_8Byr72Lg'
        }
        else return 'flow_1TEiqe8m'
    }, [userId])

    return (
        <Frigade.Provider apiKey={process.env.NEXT_PUBLIC_FRIGADE_API_KEY} userId={userId}>
            <Frigade.Tour flowId={flowId} />
            {children}
        </Frigade.Provider>
    )
}