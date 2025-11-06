"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useAuth } from "../context/userContext";

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      }
    }
  }, [loading, user]);

  if(loading) return <div className="min-h-full w-screen animate-spin flex items-center justify-center"><Loader /></div>
  return (
    <div className="px-10 py-3">
      {children}
    </div>
  );
};

export default AuthRoute;
