"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const t = useTranslations("login"); 
  const [loading , setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
        const res = await api.post('/forgot-password' , {email})
        console.log(res)

    }
    catch(err) {
        console.log(err)
    }
    finally {
        setLoading(false)
    }
  };
  return (
    <div className="screen-h flex items-center">
      <div className="mx-auto max-w-sm space-y-6 ">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("title") || "Login"}</h1>{" "}
          {/* 🌟 Translated Title */}
          <p className="text-gray-500 dark:text-gray-400">
            {t("subtitle") || "Enter your email below to login to your account"}{" "}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>{" "}
            {/* 🌟 Translated Label */}
            <Input
              id="email"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* 🌟 CHANGED: Display translated field-specific error */}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <span className="flex gap-3">Submiting <Loader className="animate-spin "/></span> : "Submit"}
            
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
