"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React, { useState } from "react";
import api from "@/lib/api";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Define the initial state for field-specific errors
const initialFieldErrors = {
  username: "",
  email: "",
  password: "",
};

// Error structure: general for generic messages, fields for validation
const initialErrors = {
  general: null,
  fields: initialFieldErrors,
};

export default function SignUpComponent() {
  const t = useTranslations("signup"); // 🌟 Initialize translation hook
  const t2 = useTranslations('errors')

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to map the backend error code to the corresponding i18n key

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const res = await api.post("/signup", { email, username, password });

      console.log(res);
      // Assuming successful signup auto-logs in
      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        // router.push("/dashboard");
      } else {
        // Successful signup, but requires login (redirect to login page)
        router.push("/login");
      }
    } catch (err) {
      if (err.response) {
        setErrors(err.response.data);
      }
      else {
         setErrors({general : 'unexpectedError'})
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 ">
      <div className="space-y-2 text-center">
        {/* 🌟 Translated Title */}
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {/* Default instructional text, optionally translated */}
          {t("subtitle") || "Entrez vos informations pour créer votre compte."}

          {/* Display the general error message (if set) */}
          {errors.general && (
            <span className="text-red-500 block mt-2">{t2(errors.general)}</span>
          )}
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">{t("username")}</Label>
          <Input
            id="username"
            type="text"
            placeholder={t("username")}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <p className="text-sm text-red-500">
              {t2(errors.username)}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-sm text-red-500">
              {t2(errors.email)}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-sm text-red-500">
              {t2(errors.password)}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex gap-2 items-center justify-center">
              {t("loadingText") || "Chargement"}{" "}
              <Loader className="animate-spin h-4 w-4" />
            </span>
          ) : (
            // 🌟 Translated Submit Button (was "Login")
            t("submit")
          )}
        </Button>
        <Button variant="outline" className="w-full" disabled={loading}>
          {/* Translated Social Login (was "Login with Google") */}
          {/* {t("socialSignup", { provider: "Google" }) ||
            "S'inscrire avec Google"} */}
        </Button>

        <div className="mt-4 text-center text-sm">
          {/* 🌟 Translated link text */}
          {t("haveAccount_prefix")}{" "}
          <Link href="/login" className="underline" prefetch={false}>
            {t("haveAccount_link")}
          </Link>
        </div>
      </form>
    </div>
  );
}
