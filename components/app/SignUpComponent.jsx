"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import api from "@/lib/api"; 
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; 
import { useState } from "react"; 
import { toast } from "sonner";
import Error from "../ui/error";

export default function SignUpComponent() {
  const t = useTranslations("signup");
  const t2 = useTranslations("errors");
  const router = useRouter(); 

  // State for general API error messages (401, 500, or unmapped errors)
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  // --- 1. ZOD SCHEMA ---
  // Note: Password min length set to 8 for security best practice, not 6.
  const signUpSchema = z
    .object({
      username: z.string().min(3, { message: t2("shortUsername") }),
      firstName: z.string().min(1, { message: t2("required") }),
      lastName: z.string().min(1, { message: t2("required") }),
      email: z.string().email({ message: t2("invalidEmail") }),
      password: z.string().min(6, { message: t2("passwordMinLength") }), 
      confirmPassword: z.string().min(1, { message: t2("requiredConfirmPassword") }), 
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t2("passwordsDontMatch"),
      path: ["confirmPassword"], 
    });


  // --- 2. RHF INITIALIZATION ---
  const {
    register,
    handleSubmit,
    // ⬅️ CRITICAL: Destructure setError to handle backend errors
    setError, 
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    }
  });


  // --- 3. API SUBMISSION LOGIC ---
  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await api.post('/signup', data);
      toast.success(t('accountCreated'))      
      router.push('/login'); 
      
    } catch (err) {
      console.error("Signup failed:", err);
      
      // Check for structured errors from the backend (e.g., status 400 or 409)
      const backendErrors = err.response?.data?.errors; 

      if (backendErrors && typeof backendErrors === 'object') {
        
        // Iterate over the error object keys (e.g., 'username', 'email')
        Object.keys(backendErrors).forEach(key => {
          const errorKey = backendErrors[key]; // This is the translation key (e.g., 'usernameTaken')
          
          if (key === 'general') {
            // Handle general errors separate from fields (rare for signup, but good practice)
            setApiError(t2(errorKey));
          } else {
            // ⬅️ SET FIELD-SPECIFIC ERROR: Map backend error to the form field
            setError(key, { 
                type: 'server', 
                message: t2(errorKey) // Use the translation key for the error message
            });
          }
        });
      } else {
        // Fallback for network errors, 500 server errors, or malformed responses
        setApiError(t2('unexpectedError'));
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
    router.push(url);
  };

  // Dedicated component for displaying field errors (must use RHF 'errors' object)
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <p className="error mt-1">{error.message}</p>;
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 ">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t("subtitle")}
        </p>
      </div>
      
      {/* ⬅️ 4. DISPLAY GENERAL API ERROR HERE (Above the form) */}
      {apiError && (
        <Error message={apiError} />
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">{t("username")}<span className="text-destructive">*</span></Label>
          <Input
            type="text"
            placeholder={t("username")}
            {...register("username")} 
          />
          <ErrorMessage error={errors.username} /> 
        </div>

        {/* First Name Field */}
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("firstName")}<span className="text-destructive">*</span></Label>
          <Input
            type="text"
            placeholder={t("firstName")}
            {...register("firstName")} 
          />
          <ErrorMessage error={errors.firstName} />
        </div>

        {/* Last Name Field */}
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("lastName")}<span className="text-destructive">*</span></Label>
          <Input
            type="text"
            placeholder={t("lastName")}
            {...register("lastName")} 
          />
          <ErrorMessage error={errors.lastName} />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}<span className="text-destructive">*</span></Label>
          <Input 
            type="email" 
            placeholder="m@example.com" 
            {...register("email")} 
          />
          <ErrorMessage error={errors.email} />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}<span className="text-destructive">*</span></Label>
          <Input 
            type="password" 
            {...register("password")} 
          />
          <ErrorMessage error={errors.password} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}<span className="text-destructive">*</span></Label>
          <Input 
            type="password" 
            {...register("confirmPassword")} 
          />
          <ErrorMessage error={errors.confirmPassword} />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading} 
        >
          {isLoading ? (
            <span className="flex gap-2 items-center justify-center">
              {t("loadingText") || "Creating account"}{" "}
              <Loader className="animate-spin h-4 w-4" />
            </span>
          ) : (
            t("submit")
          )}
        </Button>
        <Button
          type="button" 
          variant="outline"
          className="w-full "
          onClick={handleGoogleLogin}
        >
          <Image src={"/google-icon.svg"} height={20} width={20} alt="google" />
          {t("googleLogin")}
        </Button>
        <div className="mt-4 text-center text-sm">
          {t("haveAccount_prefix")}{" "}
          <Link href="/login" className="underline" prefetch={false}>
            {t("haveAccount_link")}
          </Link>
        </div>
      </form>
    </div>
  );
}