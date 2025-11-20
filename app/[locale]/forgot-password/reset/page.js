"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import UnauthorizedPage from '@/components/Unauthorized'
import api from '@/lib/api'
import { Loader2Icon } from 'lucide-react' // Use Loader2Icon for better rotation
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

// WARNING: Assuming 't' is passed via context or defined globally, which is bad practice.
// For demonstration, I will define dummy state and handler functions.
const t = (key) => {
    const translations = {
        "title": "Set New Password",
        "subtitle": "Enter your new password below.",
        "password": "New Password",
        "confirmPassword": "Confirm Password",
        "submit": "Set Password"
    };
    return translations[key] || key;
}

const PasswordResetPage = () => {
  // --- Required State ---
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams()
  const token = searchParams.get('token')


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (password.length < 6) {
      toast.error(t("validationLength"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("validationMatch"));
      return;
    }

    setLoading(true);
    // 💥 Simulated API Call (Replace with your actual reset logic)
    try {
      const res = await api.post('/forgot-password/reset' , {password , token})
      toast.success(t("success"));
      setIsError(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(t("failure"));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };


  if(!token) {
    return <UnauthorizedPage />
  }

  return (
    <div className="screen-h flex items-center">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>
        
        {/* 💥 Message Display */}
        {message && (
          <div 
            className={`p-3 rounded-md border text-sm ${
              isError 
                ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" 
                : "border-green-400 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* 1. New Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password" // CRITICAL: Must be type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* 2. Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password" // CRITICAL: Must be type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-3">
                {t("sending")} <Loader2Icon className="w-4 h-4 animate-spin" />
              </span>
            ) : (
              // 🌟 TRANSLATED BUTTON TEXT
              t("submit")
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default PasswordResetPage