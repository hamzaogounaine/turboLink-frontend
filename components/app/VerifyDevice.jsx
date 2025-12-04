"use client";
import React, { useState } from "react";
// Assuming these are components from a UI library like shadcn/ui
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl"; // Required for translation
import api from "@/lib/api";
import { toast } from "sonner";

const VerifyDevice = ({ email }) => {
  const [loading, setLoading] = useState(false); // Should be a boolean
  const [error, setError] = useState(null); // Use a single error string/object for simplicity
  const [code, setCode] = useState("");
  const t = useTranslations("deviceVerif");
  const tErrors = useTranslations("errors")
  // Assuming a generic utility for your API calls
  const API_ENDPOINT = "/verify-device";

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError(t("error_invalid_length") || "Code must be 6 digits.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(API_ENDPOINT, { email, code });
      console.log(response)
      if (response.status === 200) {
        toast.success(t(response.data.message))
        window.location.href = "/dashboard";
      } else {
        const data = await response.json();
        // Use translation for known error messages (e.g., invalidToken, expiredCode)
        setError(t(data.message) || data.message || t("error_generic"));
      }
    } catch (err) {
      console.log(err)
      setError(tErrors(err.response.data.message) || tErrors("error_network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    // Replaced 'screen-h' with a clean, standard centering pattern
    <div className="flex screen-h items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">
            {t("title") || "Device Verification"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("subtitle_1") || "A security code has been sent to:"}
            <br />
            <strong className="text-gray-800 dark:text-gray-200">
              {email}
            </strong>
            <br />
            {t("subtitle_2") || "Please check your inbox and spam folder."}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleVerificationSubmit}>
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              {t("code_label") || "Verification Code"}
            </Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric" // Better for mobile keyboards
              placeholder="123456" // Proper code placeholder
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
              minLength={6}
              className="text-center tracking-[0.5em] text-lg" // Center the text and add spacing for code
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-2 text-base"
            disabled={loading || code.length < 6}
          >
            {loading
              ? t("button_loading") || "Verifying..."
              : t("button_submit") || "Submit Code"}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            className="text-sm text-gray-500 dark:text-gray-400"
            disabled={loading}
          >
            {t("resend_link") || "Resend Code"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyDevice;
