import { getSession } from "./session";

export const fetcher = async (url, options) => {
    const session = await getSession()

    return fetch(process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT + url, {
        ...options,
        headers: {
            ...options?.headers,
            ...(session && { Authorization: `Bearer ${session.accessToken}` }),
        },
        next: { revalidate: 0 }
    })
}