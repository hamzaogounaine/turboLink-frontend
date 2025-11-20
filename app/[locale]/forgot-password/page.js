import ProtectedRoute from '@/components/protectedRoute'
import React from 'react'

const ForgotPasswordPage = () => {
  return (
    <div>
        This is the forgot password page
    </div>
  )
}

const page = () => {
    return <ProtectedRoute><ForgotPasswordPage /></ProtectedRoute>
}

export default page
