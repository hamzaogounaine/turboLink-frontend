"use client";
import React, { useEffect } from "react";
import {  useSearchParams , useRouter } from "next/navigation"; // <-- Use useSearchParams
import { useAuth } from "../context/userContext";
import LoaderComponent from "./ui/Loader";
import { setAuthToken } from "@/lib/api";
import UnauthorizedPage from "./Unauthorized";

const ProtectedRoute = ({ children }) => {
  const { user, loading , isAuthenticated } = useAuth();
  const router = useRouter();
  // CORRECTED: Use useSearchParams to get the token from the URL query
  const searchParams = useSearchParams(); 
  
  // Get the accessToken value from the query string
  const accessToken = searchParams.get('accessToken');

  
  useEffect(() => {
    if (accessToken && accessToken.length ) {
      setAuthToken(accessToken);
      router.push('/dashboard')
    }

   
    if (!loading) {
      if (!user && !isAuthenticated) {
        // Redirect to login if user is not authenticated
        router.push("/login");
      }
    }
    
  }, [isAuthenticated, user, loading]); // Dependency array updated

  // --- Render Logic ---

  // Show a loading spinner while checking authentication status
  if (loading) {
    return (
      <LoaderComponent />
    );
  }

  // If loading is done and there's no user, show unauthorized message 
  // (though the useEffect should redirect immediately)
  if (!user && !loading) {
    return <UnauthorizedPage />
  }

  // Render children if the user is authenticated
  return (
    <div className="px-6 py-3">
      {children}
    </div>
  );
};

export default ProtectedRoute;