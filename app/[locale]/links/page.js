import LinksComponent from '@/components/app/linksPage/LinksComponents'
import ProtectedRoute from '@/components/protectedRoute'
import React from 'react'

const LinksPage = () => {
  return (
    <div>
      <LinksComponent />
    </div>
  )
}


const page = () => {
    return <ProtectedRoute><LinksPage /></ProtectedRoute>
}


export default page
