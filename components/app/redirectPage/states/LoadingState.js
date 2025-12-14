// src/components/RedirectStates/LoadingState.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ t }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{t('loadingTitle')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('loadingSubtitle')}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;