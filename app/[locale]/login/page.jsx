import LoginComponent from '@/components/app/LoginComponent'
import React from 'react'
import AuthRoute from '../../../components/authRoute';


const LoginPage = () => {
  return (
    <div className='screen-h flex justify-center  items-center'>
      <LoginComponent />
    </div>
  )
}

const page = () => {
  return <AuthRoute><LoginPage /></AuthRoute>
}

export default page
