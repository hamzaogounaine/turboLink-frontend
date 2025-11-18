"use client";

import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
// 💥 You need these imports for the modal
import {
  
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog" 
import api from '@/lib/api'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const ProfileTab = ({ user }) => {
  const t = useTranslations('profileTab')
  const tNotif = useTranslations('notifications')
  
  // State Management
  const [firstName, setFirstName] = useState(user.first_name || '')
  const [lastName, setLastName] = useState(user.last_name || '')
  const [email, setEmail] = useState(user.email || '')
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '')
  // 💥 FIX: Added state for Bio. It was missing before.
  const [bio, setBio] = useState(user.bio || '') 
  
  // Modal & Loading State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // 1. Triggered when user clicks "Save Changes"
  const handlePreSubmit = () => {
    // 💥 STRICTNESS: Add validation here. Don't open the modal if the email is invalid.
    if (!firstName || !lastName || !email) {
      toast.error(tNotif('validationError')) // Ensure you have this key
      return
    }
    setIsPasswordModalOpen(true)
  }

  // 2. Triggered when user confirms password in modal
  const handleFinalSubmit = async () => {
    if (!password) {
        toast.error(tNotif('passwordRequired')) 
        return
    }

    setLoading(true)
    try {
      // 💥 We send the password along with the data to verify ownership
      const payload = {
        userId: user._id,
        firstName,
        lastName,
        email,
        phoneNumber,
        password // 💥 Verify this on the backend!
      }

      const res = await api.post('/update-profile', payload)

      if (res.status === 200) {
        toast.success(tNotif('profileUpdated'))
        setIsPasswordModalOpen(false) // Close modal on success
        setPassword('') // Clear sensitive data
      } else {
        toast.error(tNotif('profileUpdateFailure'))
      }
    } catch (err) {
      if(err.response.data.message) {
        toast.error(tNotif(err.response.data.message))
      }
      else{

        toast.error(tNotif('profileUpdateFailure'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t('heading')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first-name">{t('firstNameLabel')}</Label>
          <Input
            id="first-name"
            value={firstName} // 💥 Controlled component (value vs defaultValue)
            className="mt-1"
            placeholder={t('firstNamePlaceholder')}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="last-name">{t('lastNameLabel')}</Label>
          <Input
            id="last-name"
            value={lastName}
            className="mt-1"
            placeholder={t('lastNamePlaceholder')}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          className="mt-1"
          placeholder={t('emailPlaceholder')}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="phone">{t('phoneLabel')}</Label>
        <Input
          id="phone"
          type="text" // 'string' is not a valid HTML input type
          value={phoneNumber}
          className="mt-1"
          placeholder={t('phonePlaceholder')}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="bio">{t('bioLabel')}</Label>
        <textarea
          id="bio"
          value={bio} // 💥 Now controlled properly
          className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={4}
          placeholder={t('bioPlaceholder')}
          onChange={(e) => setBio(e.target.value)} // 💥 Added onChange
        />
      </div>

      {/* Initial Save Button */}
      <Button 
        className="bg-primary hover:bg-primary/90 text-primary-foreground" 
        disabled={loading} 
        onClick={handlePreSubmit} // Opens modal
      >
        {t('saveButton')}
      </Button>

      {/* 💥 Password Confirmation Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} className={'absolute inset-0'}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('securityCheckTitle') || 'Security Check'}</DialogTitle>
            <DialogDescription>
              {t('securityCheckDesc') || 'Please enter your password to confirm these changes.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-right">
                {t('passwordLabel') || 'Password'}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                {t('cancelButton') || 'Cancel'}
            </Button>
            <Button type="submit" onClick={handleFinalSubmit} disabled={loading}>
              {loading ? t('verifying') || 'Verifying...' : t('confirmButton') || 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfileTab