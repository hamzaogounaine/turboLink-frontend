"use client"
import React, { useState, useEffect, use } from 'react';
import { Lock, ExternalLink, Shield, AlertCircle, Loader2, CheckCircle, ArrowRight, Clock, Eye, EyeOff, Info } from 'lucide-react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

const RedirectPage = () => {
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);
  const {alias} = useParams()

  // Fetch link data
  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        // Get the short URL from the current path

        // Simulated API call - replace with actual API
        const response = await api.get(`/url/details/${alias}`);

        

        setLinkData(response.data);

        // Check if password is required
        if (response.data.requirePassword) {
          setRequirePassword(true);
        } else {
          // No password required, start countdown
          setIsRedirecting(true);
        }
      } catch (err) {
        setError(err.message || 'Failed to load link. This link may be expired or invalid.');
      } finally {
        setLoading(false);
      }
    };

    fetchLinkData();
  }, []);

  // Countdown timer for redirect
  useEffect(() => {
    if (isRedirecting && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isRedirecting && countdown === 0) {
      // Redirect to destination
      window.location.href = linkData.redirect_url;
    }
  }, [isRedirecting, countdown, linkData]);

  const handlePasswordSubmit = async () => {
    if (!password) return;
    
    setPasswordError('');
    setVerifying(true);

    try {
      // Verify password with backend
      const pathParts = window.location.pathname.split('/');
      const alias = pathParts[pathParts.length - 1];

      const response = await api.post(`/url/verify/${alias}`, { password });


      if (response.status === 200) {
        // Password correct, update link data and start redirect
        setLinkData(response.data);
        setRequirePassword(false);
        setIsRedirecting(true);
      } else {
        setPasswordError(response.data.message || 'Incorrect password. Please try again.');
      }
    } catch (err) {
      setPasswordError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleManualRedirect = () => {
    window.location.href = linkData.redirect_url;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Loading link</p>
            <p className="text-sm text-muted-foreground mt-1">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-9 h-9 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Link Not Found</h1>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md font-medium transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Password Protected State
  if (requirePassword && !isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-border bg-muted/30 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Password Required</h1>
              <p className="text-sm text-muted-foreground">This link is password protected</p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Destination Preview - Only show if available */}
              {linkData?.redirect_url && (
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Destination</p>
                      <p className="text-sm text-foreground font-medium break-all">
                        {linkData.redirect_url}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && password) {
                          handlePasswordSubmit();
                        }
                      }}
                      className="w-full h-10 px-3 pr-10 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-all"
                      placeholder="Enter password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePasswordSubmit}
                  disabled={verifying || !password}
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Unlock Link
                    </>
                  )}
                </button>
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg border border-border">
                <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-0.5">Secure Connection</p>
                  <p>Your password is encrypted in transit and never stored.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have the password? Contact the link creator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirecting State (No Password or Password Verified)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-border bg-muted/30 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Redirecting</h1>
            <p className="text-sm text-muted-foreground">You will be redirected shortly</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Countdown Timer */}
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 border-4 border-primary/20">
                <span className="text-4xl font-bold text-primary tabular-nums">{countdown}</span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Redirecting in {countdown} {countdown === 1 ? 'second' : 'seconds'}
              </p>
            </div>

            {/* Destination Info */}
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-5 border border-border">
                <div className="flex items-start gap-3 mb-3">
                  <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Taking you to</p>
                    <a
                      href={linkData.redirect_url}
                      className="text-sm font-semibold text-foreground hover:text-primary break-all hover:underline underline-offset-2 transition-colors"
                    >
                      {linkData.redirect_url}
                    </a>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
                </div>
              </div>

              {/* Stats Grid */}
              {linkData.clicks !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Total Clicks</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{linkData.clicks}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Link Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-semibold text-foreground">Active</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Redirect Button */}
            <button
              onClick={handleManualRedirect}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              Continue Now
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Safety Note */}
            <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg border border-border">
              <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-0.5">Verified Link</p>
                <p>This destination has been verified as safe to visit.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        {linkData.short_url && (
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              Short URL: <span className="font-mono font-semibold text-foreground">{linkData.short_url}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by TurboLink
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedirectPage;