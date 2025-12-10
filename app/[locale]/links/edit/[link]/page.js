"use client"
import EditLinkPage from '@/components/app/linksPage/EditLinkComponent'
import ProtectedRoute from '@/components/protectedRoute'
import { useParams } from 'next/navigation'
import React from 'react'

const EditLinkComponent = () => {
    const {link} = useParams()
  return (
    <div>
        <EditLinkPage short_url={link} />
    </div>
  )
}

const page = () => {
    return <ProtectedRoute><EditLinkComponent /></ProtectedRoute>
}

export default page
