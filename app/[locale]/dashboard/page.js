"use client"

import React from 'react'
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuth } from '../../../context/userContext';


const Dashboard = () => {
    const {user } = useAuth()

  return (
    <div>
      This is the user {user && user.username}
    </div>
  )
}

const page = ( ) => {
    return <ProtectedRoute >
        {<Dashboard />}
    </ProtectedRoute>
} 

export default page