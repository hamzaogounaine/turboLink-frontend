"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const t = useTranslations("forgotPassword"); 
  
  // State for form data, loading, and user feedback message
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous message
    setIsError(false);
    setLoading(true);
    toast.loading(t('sending'))

    try {
      const res = await api.post('/forgot-password', { email });
      console.log(res);

      
      toast.success(t("successMessage"));
      
      // You may want to clear the email here: setEmail(""); 
    } catch (err) {
      console.error(err);
      
      // 🌟 CRITICAL FIX: Set error message from translations
      setMessage(t("errorMessage"));
      setIsError(true);
    } finally {
      toast.dismiss()
      setLoading(false);
    }
  };
  
  // Use a dedicated translation path for the forgot password view

  return (
    <div className="screen-h flex items-center">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>
        
        {/* 💥 NEW: Message Display */}
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
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={email} // Control the input value
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} // Disable input while loading
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-3">
                Sending <Loader className="w-4 h-4 animate-spin" />
              </span>
            ) : (
              // 🌟 TRANSLATED BUTTON TEXT
              t("submit")
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;