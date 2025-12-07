"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// 💥 You need these imports for the modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Script from "next/script";

const ProfileTab = ({ user }) => {
  const t = useTranslations("profileTab");
  const tNotif = useTranslations("notifications");

  // State Management
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");
  const [bio, setBio] = useState(user.bio || "");
  const [isVerficationModalOpen, setVerificationModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Triggered when user clicks "Save Changes"
  const handlePreSubmit = () => {
    // 💥 STRICTNESS: Add validation here. Don't open the modal if the email is invalid.
    if (!firstName || !lastName || !email) {
      toast.error(tNotif("validationError")); // Ensure you have this key
      return;
    }
    setVerificationModal(true);
  };

  // 2. Triggered when user confirms password in modal
  const handleFinalSubmit = async () => {
    if (!password) {
      toast.error(tNotif("passwordRequired"));
      return;
    }

    setLoading(true);
    try {
      // 💥 We send the password along with the data to verify ownership
      const payload = {
        userId: user._id,
        firstName,
        lastName,
        email,
        phoneNumber,
        password, // 💥 Verify this on the backend!
      };

      const res = await api.post("/update-profile", payload);

      if (res.status === 200) {
        toast.success(tNotif("profileUpdated"));
        setVerificationModal(false); // Close modal on success
        setPassword(""); // Clear sensitive data
      } else {
        toast.error(tNotif("profileUpdateFailure"));
      }
    } catch (err) {
      if (err.response.data.message) {
        toast.error(tNotif(err.response.data.message));
        setVerificationModal(false);
      } else {
        toast.error(tNotif("profileUpdateFailure"));
      }
  } finally {
      setLoading(false);
    }
  };

  // Add this function inside your ProfileTab component
  const handleGoogleReauthenticate = () => {
    setLoading(true);

    try{

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: async (tokenResponse) => {

        const { access_token } = tokenResponse;
        if (!access_token) {
          toast.error("Failed to get access token from Google");
          return setLoading(false);
        }

        handleGoogleFinaleSubmit(access_token);

      },
    });

    tokenClient.requestAccessToken({
      prompt: "select_account",
    });
    
  }catch(err) {
    console.log(err)
  }
    finally{
      setLoading(false)
    }
  };

  const handleGoogleFinaleSubmit = async (accessToken) => {
    if (!accessToken) {
      toast.error("Google verification required");
    }

    try {
      const res = await api.post("/update-google-profile", {
        userId: user._id,
        accessToken,
        firstName,
        lastName,
        phoneNumber
      });
      toast.success('Profile updated successfully')
    } catch (err) {
      console.log(err);
      toast.error('Error occured !')
    }
    finally{
      setVerificationModal(false)
      setLoading(false)
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t("heading")}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first-name" >{t("firstNameLabel")}<span className="text-destructive">*</span></Label>
          <Input
            id="first-name"
            value={firstName} // 💥 Controlled component (value vs defaultValue)
            className="mt-1"
            placeholder={t("firstNamePlaceholder")}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="last-name">{t("lastNameLabel")}<span className="text-destructive">*</span></Label>
          <Input
            id="last-name"
            value={lastName}
            className="mt-1"
            placeholder={t("lastNamePlaceholder")}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">{t("emailLabel")}<span className="text-destructive">*</span></Label>
        <Input
          id="email"
          type="email"
          value={email}
          placeholder={t("emailPlaceholder")}
          onChange={(e) => setEmail(e.target.value)}
          disabled={user.is_google_user}
          className={`mt-1 ${
            user.is_google_user && "hover:cursor-not-allowed"
          }`}
        />
      </div>

      <div>
        <Label htmlFor="phone">{t("phoneLabel")}</Label>
        <Input
          id="phone"
          type="text" // 'string' is not a valid HTML input type
          value={phoneNumber}
          className="mt-1"
          placeholder={t("phonePlaceholder")}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="bio">{t("bioLabel")}</Label>
        <textarea
          id="bio"
          value={bio} // 💥 Now controlled properly
          className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={4}
          placeholder={t("bioPlaceholder")}
          onChange={(e) => setBio(e.target.value)} // 💥 Added onChange
        />
      </div>

      {/* Initial Save Button */}
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={loading}
        onClick={handlePreSubmit} // Opens modal
      >
        {t("saveButton")}
      </Button>

      {!user.is_google_user && (
        <Dialog
          open={isVerficationModalOpen}
          onOpenChange={setVerificationModal}
          className={"absolute inset-0"}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {t("securityCheckTitle") || "Security Check"}
              </DialogTitle>
              <DialogDescription>
                {t("securityCheckDesc") ||
                  "Please enter your password to confirm these changes."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-right">
                  {t("passwordLabel") || "Password"}
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
              <Button
                variant="outline"
                onClick={() => setVerificationModal(false)}
              >
                {t("cancelButton") || "Cancel"}
              </Button>
              <Button
                type="submit"
                onClick={handleFinalSubmit}
                disabled={loading}
              >
                {loading
                  ? t("verifying") || "Verifying..."
                  : t("confirmButton") || "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {user.is_google_user && (
        <Dialog
          open={isVerficationModalOpen}
          onOpenChange={setVerificationModal}
          className={"absolute inset-0"}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{"Security Check"}</DialogTitle>
              <DialogDescription>
                {t("securityCheckDesc") ||
                  "Please enter your password to confirm these changes."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                className="w-fit mx-auto px-10 "
                disabled={loading}
                onClick={handleGoogleReauthenticate}
              >
                <Image
                  src={"/google-icon.svg"}
                  height={20}
                  width={20}
                  alt="google"
                />
                Verify using google
              </Button>
            </div>
            
          </DialogContent>
        </Dialog>
      )}
      <Script
        id=""
        src="https://accounts.google.com/gsi/client"
        async
        defer
      ></Script>
    </div>
  );
};

export default ProfileTab;
