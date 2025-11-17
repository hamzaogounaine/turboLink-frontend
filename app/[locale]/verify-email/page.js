"use client";

import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  // Translation hook
  const t = useTranslations('emailVerification'); 

  // State to manage the verification status and message
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'failure', 'error', 'no_token'
  const [message, setMessage] = useState(t('statusLoading'));

  useEffect(() => {
    if (!token) {
      setStatus('no_token');
      setMessage(t('errorNoToken'));
      return;
    }

    const verifyEmail = async () => {
      setStatus('loading');
      setMessage(t('statusLoading'));

      try {
        const res = await api.post('/verify-email', { token });
        
        // Handle successful verification (status 200/201)
        if (res.status === 200) {
          setStatus('success');
          setMessage(t('statusSuccess'));
        } else {
          // This block might catch non-error 2xx responses with custom messages (less common)
          // For simplicity, we assume 200 is success and others are errors handled by the catch block
        }

      } catch (err) {
        setStatus('failure');
        // Extract a specific error message from the backend response if available
        const backendMessage = err.response?.data?.message || err.response?.data;
        
        // Handle specific known error messages from your backend
        if (backendMessage === 'Email already verified') {
            setMessage(t('statusAlreadyVerified'));
        } else if (backendMessage === 'Invalid token' || backendMessage === 'jwt expired') {
            // Note: Your backend should return a 403 on invalid/expired tokens, not 404
            setMessage(t('errorInvalidToken'));
        } else {
            // General failure message
            setMessage(t('statusFailure'));
        }
      }
    };

    verifyEmail();
  }, [token]);


  const getIcon = (currentStatus) => {
    switch (currentStatus) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'failure':
      case 'error':
      case 'no_token':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="p-8 w-full max-w-md text-center shadow-lg">
        <div className="mb-4">
          {getIcon(status)}
        </div>
        
        <h1 className="text-2xl font-bold mb-2">
          {t('heading')}
        </h1>
        
        <p className={`text-lg ${status === 'failure' || status === 'no_token' ? 'text-red-600' : status === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
          {message}
        </p>
        
        {/* Optional: Add a link for the user to go to the login page on success/failure */}
        {(status === 'success' || status === 'failure' || status === 'no_token') && (
            <div className="mt-6">
                <a href="/login" className="text-sm text-blue-500 hover:underline">
                    {t('linkToLogin')}
                </a>
            </div>
        )}

      </Card>
    </div>
  );
};

export default VerifyEmailPage;