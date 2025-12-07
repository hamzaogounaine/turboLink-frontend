import ProtectedRoute from '@/components/protectedRoute'
import React from 'react'

const LinksPage = () => {
  return (
    <div>
      LinksPage
    </div>
  )
}


const page = () => {
    return <ProtectedRoute><LinksPage /></ProtectedRoute>
}


export default page
