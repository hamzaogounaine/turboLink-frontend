// pages/RedirectPage.jsx
"use client"
import React from 'react';
import { useTranslations } from 'use-intl';
import useRedirectLogic from './useRedirectLogic';
import LoadingState from './states/LoadingState';
import ErrorState from './states/ErrorState';
import DisabledState from './states/DisableState';
import PasswordState from './states/PasswordState';
import RedirectState from './states/RedirectState';
// Import the separate UI components


const RedirectPage = () => {
  // --- 1. Use Custom Hook for ALL Logic ---
  const { 
    loading, error, disabled, requirePassword, isRedirecting, 
    linkData, password, showPassword, passwordError, verifying, 
    setPassword, toggleShowPassword, handlePasswordSubmit, handleManualRedirect
  } = useRedirectLogic();

  const t = useTranslations('redirectPage')
  
  
  if (loading) {
    return <LoadingState t={t} />;
  }

  if (error) {
    return <ErrorState t={t} error={error} />;
  } 
  
  if (disabled) {
    return <DisabledState t={t} />;
  }

  // Password needed and not verified yet
  if (requirePassword && !isRedirecting) {
    return (
      <PasswordState
        t={t}
        linkData={linkData}
        password={password}
        showPassword={showPassword}
        passwordError={passwordError}
        verifying={verifying}
        setPassword={setPassword}
        toggleShowPassword={toggleShowPassword}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    );
  }

  // Ready to redirect (password verified or not required)
  if (isRedirecting && linkData) {
    return (
      <RedirectState
        t={t}
        linkData={linkData}
        handleManualRedirect={handleManualRedirect}
      />
    );
  }
  
  // Fallback state (should ideally not be reached)
  return <ErrorState t={t} error={t('errorSubtitle')} />;
};

export default RedirectPage;