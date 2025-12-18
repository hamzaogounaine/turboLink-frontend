import AnalyticsComponent from '@/components/app/analyticsPage/AnalyticsComponent'
import ProtectedRoute from '@/components/protectedRoute'
import api from '@/lib/api'
import React from 'react'

const AnalyticsPage= () => {
  
  return (
    <div>
      <AnalyticsComponent />
    </div>
  )
}

const page = () => {
  return <ProtectedRoute ><AnalyticsPage /></ProtectedRoute>
}

export default page
