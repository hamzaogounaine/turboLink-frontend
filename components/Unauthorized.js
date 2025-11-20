"use client"

import { Button } from '@/components/ui/button'
import { LogInIcon, HomeIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

// ⚠️ DUMMY TRANSLATION FUNCTION (Using ARABIC text for the translation request)

const UnauthorizedPage = () => {
  const t = useTranslations('unauthorized')

  // ASSUMPTION: The login route is '/auth/login' and the home route is '/'
  const LOGIN_ROUTE = '/login';
  const HOME_ROUTE = '/';

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="mx-auto max-w-md space-y-8 text-center p-8  rounded-lg ">
        
        {/* HTTP Status Code Display - Clear and intimidating */}
        <h1 className="text-8xl font-extrabold text-red-600 dark:text-red-400">
          401
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("unauthorizedTitle")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("unauthorizedSubtitle")}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          {/* Action 1: Login */}
          <Link href={LOGIN_ROUTE} passHref>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <LogInIcon className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
              {t("loginButton")}
            </Button>
          </Link>
          
          {/* Action 2: Go Home */}
          <Link href={HOME_ROUTE} passHref>
            <Button variant="outline" className="w-full sm:w-auto text-gray-700 dark:text-gray-300">
              <HomeIcon className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
              {t("homeButton")}
            </Button>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage