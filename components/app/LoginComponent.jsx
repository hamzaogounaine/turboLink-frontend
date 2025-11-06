"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React, { useState } from "react";
import api from "@/lib/api"; // Assuming your configured Axios instance
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl"; // 🌟 ADDED: Import for translations
import { useAuth } from "@/context/userContext";

// Define a more specific type for field errors (keys should match the backend validation fields)
const initialFieldErrors = {
  email: null,
  password: null,
};

// Error structure: general for generic messages, fields for validation
const initialErrors = {
  general: null, // Stores the translation key for the general error (e.g., 'errors.invalidCredentials')
  fields: initialFieldErrors, // Stores the translation key for field-specific errors
};

export default function LoginComponent() {
  const t = useTranslations("login"); // 🌟 ADDED: Initialize translation hook
  const t2 = useTranslations("errors");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {login} = useAuth()

  // 🌟 ADDED: Function to map the backend error code to the corresponding i18n key

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors on new submission

    try {
      const res = await api.post("/login", { email, password });

      console.log(res);
      login(res.data.accessToken)
      // localStorage.setItem("accessToken", res.data.accessToken);

      router.push("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("unexpectedError");
      }
    } finally {
      // Execute regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 ">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("title") || "Login"}</h1>{" "}
        {/* 🌟 Translated Title */}
        <p className="text-gray-500 dark:text-gray-400">
          {t("subtitle") || "Enter your email below to login to your account"}{" "}
          {/* 🌟 Translated Subtitle */}
          {/* 🌟 CHANGED: Display the translated general error message */}
          {error && (
            <span className="text-red-500 block mt-2">
              {t2(error)}
            </span>
          )}
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>{" "}
          {/* 🌟 Translated Label */}
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* 🌟 CHANGED: Display translated field-specific error */}
          
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>{" "}
          {/* 🌟 Translated Label */}
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* 🌟 CHANGED: Display translated field-specific error */}
          
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex gap-2 items-center justify-center">
              {t("loadingText") || "Loading"}{" "}
              <Loader className="animate-spin h-4 w-4" />{" "}
              {/* 🌟 Translated Loading Text */}
            </span>
          ) : (
            t("submit") || "Login" // 🌟 Translated Submit Button
          )}
        </Button>
        <Button variant="outline" className="w-full" disabled={loading}>
          {/* {t("socialLogin", { provider: "Google" }) || "Login with Google"}{" "} */}
          {/* 🌟 Translated Social Login */}
        </Button>
        <Link
          href="#"
          className="inline-block w-full text-center text-sm underline"
          prefetch={false}
        >
          {t("forgotPassword") || "Forgot your password?"}{" "}
          {/* 🌟 Translated Link */}
        </Link>
        {/* 🌟 ADDED: Link to Sign Up for completeness */}
        <div className="mt-4 text-center text-sm">
          {t("noAccount_prefix") || "Don't have an account?"}{" "}
          <Link href="/signup" className="underline" prefetch={false}>
            {t("noAccount_link") || "Sign Up"}
          </Link>
        </div>
      </form>
    </div>
  );
}
