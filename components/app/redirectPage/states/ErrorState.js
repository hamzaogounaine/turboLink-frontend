// src/components/RedirectStates/ErrorState.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ t, error }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-9 h-9 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('errorTitle')}</h1>
            <p className="text-muted-foreground">{error || t('errorSubtitle')}</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md font-medium transition-colors"
          >
            {t('goHome')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;