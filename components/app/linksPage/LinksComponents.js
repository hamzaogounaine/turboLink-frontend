// LinksComponents.tsx

"use client"
// Use a superior data fetching library like SWR
import useSWR from 'swr'
import api from '@/lib/api'
import React from 'react'
import LinkCard from './LinkCard'

// Define a fetcher function that SWR will use
const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data // Return the actual data payload
}

const LinksComponent = () => {
    // SWR automatically handles loading, error, and caching
    const { data: links, error, isLoading } = useSWR('/url/me', fetcher)

    if (isLoading) return <div>Loading links...</div>
    if (error) return <div>Error: Failed to fetch links. Fix your API or your client!</div>
    if (!links || links.length === 0) return <div>No links found. Get to work.</div>

    return (
        <div>
            <h1 className='text-lg'>Your Links :</h1>
            {links.map(link => (
                <LinkCard key={link._id} link={link} />
            ))}
        </div>
    )
}

export default LinksComponent