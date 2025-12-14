// src/components/RedirectStates/PasswordState.jsx
import React from 'react';
import { Lock, ExternalLink, Shield, Loader2, Eye, EyeOff, Info } from 'lucide-react';
// Assuming Error component is imported
import Error from '@/components/ui/error'; 

const PasswordState = ({ 
  t, linkData, password, showPassword, passwordError, verifying, 
  setPassword, toggleShowPassword, handlePasswordSubmit 
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="border-b border-border bg-muted/30 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('passwordTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('passwordSubtitle')}</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            
            {/* Destination Preview */}
            {linkData?.redirect_url && (
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{t('destination')}</p>
                    <p className="text-sm text-foreground font-medium break-all">
                      {linkData.redirect_url}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Password Input & Submit */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  {t('passwordLabel')}
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
                    placeholder={t('passwordPlaceholder')}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <Error message={passwordError} />
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
                    {t('verifying')}
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    {t('unlockLink')}
                  </>
                )}
              </button>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg border border-border">
              <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-0.5">{t('secureConnection')}</p>
                <p>{t('secureNote')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t('contactCreator')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordState;