import SignUpComponent from '@/components/app/SignUpComponent'
import AuthRoute from '@/components/authRoute'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className=' screen-h flex justify-center  items-center'>
      <SignUpComponent />
    </div>
  )
}
const page = () => {
  return <AuthRoute><SignUpPage /></AuthRoute>
}

export default page
