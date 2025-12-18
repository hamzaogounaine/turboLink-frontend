// src/hooks/useRedirectLogic.js

import { useState, useEffect } from 'react'; // <-- Ensure useEffect is imported
import { useParams } from 'next/navigation';
import useSWR from 'swr'; 
// Import mutate from SWR for manual cache updates
import { mutate } from 'swr'; 
import api from '@/lib/api';
// Assuming t is imported from your i18n file (or defined locally if simple)
// NOTE: I am assuming t is passed in or globally accessible for now. 
// If it's passed in, the hook signature needs to change: const useRedirectLogic = (t) => { ... }
// For now, I'll assume you resolve the t function import/availability.

// --- SWR Fetcher Function ---
const fetcher = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    // SWR expects the fetcher to throw on error
    throw error.response?.data?.message || 'Failed to load link.';
  }
};



const useRedirectLogic = () => { // Adding 't' here if it's not global
  const [passwordState, setPasswordState] = useState({
    password: '',
    showPassword: false,
    passwordError: '',
    verifying: false,
    requirePassword: false, 
  });
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { alias } = useParams();
  
  // --- 1. CORE DATA FETCHING with useSWR ---
  const { data, error, isLoading } = useSWR(
    alias ? `/url/details/${alias}` : null, 
    fetcher,
    {
      revalidateOnFocus: false, 
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );

  // --- 2. SWR Side Effect (CRITICAL FIX: Use useEffect) ---
  useEffect(() => {
    // Only run this logic once data is successfully fetched
    if (data) {
      // Use optional chaining carefully, though SWR 'data' should be guaranteed here
      const isPasswordProtected = data?.requirePassword;
      
      // Update password-related state based on fetched data
      setPasswordState(s => ({
        ...s, 
        requirePassword: isPasswordProtected
      }));
      
      // If not password protected, immediately set to redirecting state
      if (!isPasswordProtected) {
        setIsRedirecting(true);
      }
    }
    // Dependency array ensures this runs when 'data' changes (i.e., on successful fetch)
  }, [data]); 
  
  // --- Unified State Setter for Password Logic ---
  const updatePasswordState = (newState) => setPasswordState(s => ({ ...s, ...newState }));

  // --- 3. Derived States from SWR/State ---
  const linkData = data;
  const loading = isLoading;
  
  let finalError = null;
  let disabled = false;

  if (error) {
    // Check for the specific disabled error message from the fetcher
    if (error === "urlDisabled") {
      disabled = true;
    } else {
      // Use the generic translation key if 't' is available, otherwise use raw error
      finalError = t ? t('errorSubtitle') : error; 
    }
  }

  // --- 4. Handlers ---
  const handlePasswordSubmit = async () => {
    if (!passwordState.password) return;
    
    updatePasswordState({ passwordError: '', verifying: true });

    try {
      const response = await api.post(`/url/verify/${alias}`, { password: passwordState.password });

      if (response.status === 200) {
        mutate(`/url/details/${alias}`, response.data, false); 
        
        setPasswordState(s => ({ ...s, requirePassword: false }));
        setIsRedirecting(true);
      } else {
        updatePasswordState({ passwordError: response.data?.message || t('incorrectPassword') });
      }
    } catch (err) {
      updatePasswordState({ passwordError: t('verificationFailed') });
    } finally {
      updatePasswordState({ verifying: false });
    }
  };

  const handleManualRedirect = () => {
    if (linkData?.short_url) {
      api.post(`/url/analytics/${linkData.short_url}` , {referrer : document.referrer || 'direct'}); 
    }
    window.location.href = linkData.redirect_url;
  };
  
  const setPassword = (p) => updatePasswordState({ password: p });
  const toggleShowPassword = () => updatePasswordState({ showPassword: !passwordState.showPassword });
  
  return {
    linkData,
    loading,
    error: finalError,
    disabled,
    isRedirecting,
    ...passwordState,
    setPassword,
    toggleShowPassword,
    handlePasswordSubmit,
    handleManualRedirect,
  };
};

export default useRedirectLogic;