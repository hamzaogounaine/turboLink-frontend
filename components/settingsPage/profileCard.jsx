"use client";

import { useAuth } from "@/context/userContext";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Camera, Mail, MapPin, Phone } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import api from "@/lib/api";
import { useTranslations } from "next-intl";

const ProfileCard = ({user}) => {
  const [isResending, setIsResending] = useState(false);
  const [hasSent , setHasSent] = useState(false)
  const t = useTranslations('profileCard'); 
  const tNotif = useTranslations('notifications');

  const formatJoinDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleResend = async () => {
    if (!user || user.emailVerified || isResending) return;

    setIsResending(true);
    toast.loading(tNotif("sendingVerification")); 

    try {
      const response = await api.post('resend-verification-link' , {userId : user._id})
      toast.dismiss(); 
      console.log(response)
      if (response.status === 200) {
        setHasSent(true)
        toast.success(
          data.message || tNotif("verificationSuccess")
        );
      } else {
        toast.error(
          data.response.message || tNotif("verificationFailure")
        );
      }
    } catch (error) {
      toast.dismiss();
      toast.error(tNotif("verificationFailure")); 
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="">
      <Card className="p-6 border border-border">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.username}
              />
              <AvatarFallback className="text-lg">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-xl font-semibold text-foreground text-center mb-1">
            {user.username}
          </h2>

          <div className="w-full space-y-3 mt-4 pt-4 border-t border-border">
            {/* 💥 REFINED EMAIL SECTION */}
            {/* Added mb-2 for a little space above the phone number */}
            <div className="flex flex-col gap-1 mb-2"> 
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                    <span className="font-semibold text-xs ml-2">
                        {user.is_email_verified ? t('statusVerified') : t('statusPending')}
                    </span>
                </div>
                
                {!user.is_email_verified && !hasSent && (
                    <Button 
                        // Use outline variant for lower visual hierarchy
                        variant="outline" 
                        size={'sm'} 
                        // Increased text size slightly and margin for better separation
                        className={'text-xs self-start mt-2'} 
                        disabled={isResending} 
                        onClick={handleResend}
                    >
                        {t('resendButton')}
                    </Button>
                )}
                {hasSent && <p className="text-sm text-green-500">{tNotif('verificationSuccess')}</p>}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{user.phone_number}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{user.location || t('locationUnknown')} </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border w-full text-center">
            {t('joinedPrefix')} {formatJoinDate(user.createdAt)}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCard;