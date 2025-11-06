import React from 'react'
import ProtectedRoute from '../../../components/protectedRoute'

const SettingsPage = () => {
  return (
    <div>
      Settngs
    </div>
  )
}

const page = () => {
    return <ProtectedRoute>
        <SettingsPage />
    </ProtectedRoute>
}

export default page
