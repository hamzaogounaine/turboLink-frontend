// src/components/RedirectStates/RedirectState.jsx
import React from 'react';
import { CheckCircle, ExternalLink, ArrowRight, Shield } from 'lucide-react';

const RedirectState = ({ t, linkData, handleManualRedirect }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="border-b border-border bg-muted/30 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('redirectingTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('redirectingSubtitle')}</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            
            {/* Destination Info */}
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-5 border border-border">
                <div className="flex items-start gap-3 mb-3">
                  <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-2">{t('takingYouTo')}</p>
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
                    <p className="text-xs text-muted-foreground mb-1">{t('totalClicks')}</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{linkData.clicks}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">{t('linkStatus')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 ${linkData.is_active ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`}></div>
                      <p className="text-sm font-semibold text-foreground">
                        {linkData.is_active ? t('statusActive') : t('statusDisabled')}
                      </p>
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
              {t('continueNow')}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Safety Note */}
            <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg border border-border">
              <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-0.5">{t('verifiedLink')}</p>
                <p>{t('verifiedNote')}</p>
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
              {t('poweredBy')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedirectState;