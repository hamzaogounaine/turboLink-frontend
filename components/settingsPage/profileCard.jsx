"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Camera, Check, Link as LinkIcon, Mail, MapPin, MonitorUpIcon, Phone, ChevronLeft } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import api from "@/lib/api";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const ProfileCard = ({ user }) => {
  const t = useTranslations('profileCard'); 
  const tNotif = useTranslations('notifications');

  // UI States
  const [isResending, setIsResending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [uploadType, setUploadType] = useState(null); // 'url' | 'local' | null
  const [loading, setLoading] = useState(false);

  // Data Entry States
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");

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
    if (!user || user.is_email_verified || isResending) return;

    setIsResending(true);
    const toastId = toast.loading(tNotif("sendingVerification"));

    try {
      const response = await api.post('/resend-verification-link', { userId: user._id });
      
      toast.dismiss(toastId);
      
      if (response.status === 200) {
        setHasSent(true);
        toast.success(response.data?.message || tNotif("verificationSuccess"));
      } else {
        toast.error(response.data?.message || tNotif("verificationFailure"));
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error(tNotif("verificationFailure"));
    } finally {
      setIsResending(false);
    }
  };

  const resetModal = () => {
    setIsChangingAvatar(false);
    setUploadType(null);
    setSelectedFile(null);
    setAvatarUrlInput("");
    setLoading(false);
  };

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(tNotif("fileTooLarge"));
            return;
        }
        setSelectedFile(file);
    }
  };

  // 2. The Logic to Process the Avatar Update
  const handleSaveAvatar = async () => {
    setLoading(true);
    let finalAvatarUrl = "";

    try {
      // STRATEGY A: Upload Local File to S3/Cloudinary first
      if (uploadType === 'local') {
        if (!selectedFile) {
          toast.error(tNotif("fileNotSelected"));
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        // 💥 Uses the endpoint we built previously
        const uploadRes = await api.post('/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (uploadRes.status === 200) {
            finalAvatarUrl = uploadRes.data.url;
        } else {
            throw new Error("Upload failed");
        }
      } 
      
      // STRATEGY B: Use Direct URL
      else if (uploadType === 'url') {
        if (!avatarUrlInput || !avatarUrlInput.startsWith('http')) {
             toast.error(tNotif('invalidUrl'));
             setLoading(false);
             return;
        }
        finalAvatarUrl = avatarUrlInput;
      }

     
      const updateRes = await api.post('/update-avatart-url', {
        userId: user._id,
       
        avatar: finalAvatarUrl 
      });

      if (updateRes.status === 200) {
        toast.success(tNotif('profileUpdated'));
        // 💥 FORCE REFRESH or use a context method here to update the UI immediately
        window.location.reload(); 
      } else {
        toast.error(tNotif('profileUpdateFailure'));
      }

    } catch (err) {
      console.error(err);
      toast.error(tNotif('profileUpdateFailure'));
    } finally {
      setLoading(false);
      resetModal();
    }
  };

  return (
    <div className="">
      <Card className="p-6 border border-border">
        <div className="flex flex-col items-center">
          <div className="relative mb-4 group">
            <Avatar className="h-24 w-24 cursor-pointer border-2 border-transparent group-hover:border-primary transition-all">
              <AvatarImage
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.username}
                className="object-cover"
              />
              <AvatarFallback className="text-lg">
                {user.username?.slice(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
            
            <button 
                onClick={() => setIsChangingAvatar(true)} 
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-xl font-semibold text-foreground text-center mb-1">
            {user.username}
          </h2>

          <div className="w-full space-y-3 mt-4 pt-4 border-t border-border">
            {/* Email Section */}
            <div className="flex flex-col gap-1 mb-2"> 
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                    <span className={`font-semibold text-xs ml-2 ${user.is_email_verified ? "text-green-600" : "text-yellow-600"}`}>
                        {user.is_email_verified ? t('statusVerified') : t('statusPending')}
                    </span>
                </div>
                
                {!user.is_email_verified && !hasSent && (
                    <Button 
                        variant="outline" 
                        size={'sm'} 
                        className={'text-xs self-start mt-1 h-7'} 
                        disabled={isResending} 
                        onClick={handleResend}
                    >
                        {isResending ? "Sending..." : t('resendButton')}
                    </Button>
                )}
                {hasSent && <p className="text-xs text-green-500 mt-1">{tNotif('verificationSuccess')}</p>}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{user.phone_number || "No phone"}</span>
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

      {/* 💥 CLEANER DIALOG LOGIC */}
      <Dialog open={isChangingAvatar} onOpenChange={(open) => !open && resetModal()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t('changeAvatarTitle') || "Change Avatar"}</DialogTitle>
            <DialogDescription>
              {t('changeAvatarDesc') || "Choose how you want to update your profile picture."}
            </DialogDescription>
          </DialogHeader>

          {/* SELECTION MENU */}
          {!uploadType && (
            <div className="grid grid-cols-2 gap-4 mt-2">
                <button 
                    onClick={() => setUploadType('url')}
                    className="border border-border rounded-xl p-4 flex flex-col items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <LinkIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">From URL</span>
                </button>
                <button 
                    onClick={() => setUploadType('local')}
                    className="border border-border rounded-xl p-4 flex flex-col items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <MonitorUpIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">Upload File</span>
                </button>
            </div>
          )}

          {/* LOCAL UPLOAD VIEW */}
          {uploadType === 'local' && (
            <div className="py-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                   <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setUploadType(null)}>
                        <ChevronLeft className="h-4 w-4" />
                   </Button>
                   <span>Upload from device</span>
                </div>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                )}
            </div>
          )}

          {/* URL UPLOAD VIEW */}
          {uploadType === 'url' && (
            <div className="py-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                   <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setUploadType(null)}>
                        <ChevronLeft className="h-4 w-4" />
                   </Button>
                   <span>Enter Image URL</span>
                </div>
                <Label className="sr-only">Image URL</Label>
                <Input 
                    type='text' 
                    placeholder='https://example.com/image.png'
                    value={avatarUrlInput}
                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                />
            </div>
          )}

          {uploadType && (
            <DialogFooter>
                <Button variant="outline" onClick={resetModal} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" onClick={handleSaveAvatar} disabled={loading}>
                    {loading ? "Saving..." : "Confirm"}
                </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileCard;