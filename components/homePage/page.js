'use client';

import { useState } from 'react';
// Removing Card imports: Card, CardContent, CardDescription, CardHeader, CardTitle
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Copy, Link as LinkIcon, Lock, Zap } from 'lucide-react'; 
import { Separator } from '@/components/ui/separator'; 
import api from '@/lib/api';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [password, setPassword] = useState('');
  const [maxClicks, setMaxClicks] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error , setError] = useState(null)
  const tError = useTranslations('errors')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortenedUrl('')
    setError('')
    if (!longUrl) return; 
    setIsLoading(true);

    try {
      const response = await api.post('/shorten', {
          longUrl,
          customAlias: customAlias || undefined,
          password: password || undefined,
          maxClicks: maxClicks ? Number.parseInt(maxClicks) : undefined,
        });

      setShortenedUrl(response.data.shortUrl);
      setCustomAlias('');
      setPassword('');
      setMaxClicks('');

    } catch (error) {
        setError(tError(error.response.data.message));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl);
      alert('Copied to clipboard!'); 
    }
  };

  return (
    // FULL SCREEN WRAPPER
    <main className="md:screen-h flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-4xl py-20">
        
        {/* HEADER SECTION (Former CardHeader) */}
        <header className="text-center mb-10">
          <h1 className="text-6xl font-extrabold tracking-tighter text-foreground">
              Turbo Link
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            The world's fastest way to shorten, secure, and track your links. Optimized for speed and clarity.
          </p>
        </header>

        {/* INPUT/FORM SECTION (Replaced Card with a simple div container) */}
        <div className="p-8 **bg-muted/10** border border-border rounded-xl shadow-2xl **max-w-3xl mx-auto**">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Primary Input */}
            <div className="space-y-2">
              <Label htmlFor="long-url" className="text-base font-semibold text-foreground flex items-center">
                Original URL (Required)
              </Label>
              <Input
                id="long-url"
                type="url"
                placeholder="Paste your incredibly long link here..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
                className="md:h-14 h-10 text-lg border-primary/50 focus-visible:ring-primary"
              />
            </div>

            <Separator />

            {/* Advanced Options Toggle */}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-primary hover:text-primary/80"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span className="flex items-center text-base font-semibold">
                {showAdvanced ? 'Hide Optional Settings' : 'Add Customizations'}
                {showAdvanced ? <ChevronUp className="w-5 h-5 ml-1" /> : <ChevronDown className="w-5 h-5 ml-1" />}
              </span>
            </Button>
            
            {/* Collapsible Advanced Fields */}
            <div className={`space-y-4 overflow-hidden transition-all duration-300 ${showAdvanced ? 'max-h-96 opacity-100 pt-2' : 'max-h-0 opacity-0'}`}>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Custom Alias Input */}
                  <div className="space-y-2">
                    <Label htmlFor="custom-alias" className="text-sm font-medium text-foreground flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2 text-muted-foreground" /> Short ID
                    </Label>
                    <Input
                      id="custom-alias"
                      type="text"
                      placeholder="custom-link"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      className=""
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-muted-foreground" /> Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Secure link"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className=""
                    />
                  </div>

                  {/* Max Clicks Input */}
                  <div className="space-y-2">
                    <Label htmlFor="max-clicks" className="text-sm font-medium text-foreground flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-muted-foreground" /> Max Clicks
                    </Label>
                    <Input
                      id="max-clicks"
                      type="number"
                      placeholder="Unlimited"
                      value={maxClicks}
                      onChange={(e) => setMaxClicks(e.target.value)}
                      min="1"
                      className=""
                    />
                  </div>
              </div>
            </div>
            <div>
                {error && <p className='text-destructive text-center'>{error}</p>}
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !longUrl}
              className="w-full md:h-14 h-12 mt-6 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </span>
              ) : (
                'Generate Short Link'
              )}
            </Button>
          </form>

          {/* Result Display */}
          {shortenedUrl && (
            <div className="mt-8 md:p-6 p-3 bg-secondary/50 rounded-lg border border-primary/30 space-y-3">
              <p className="text-lg text-primary font-medium">Link Created Successfully:</p>
              <div className="flex items-center gap-2">
                <code 
                  className="flex-1 bg-background md:px-4 md:py-3 px-2 py-1 rounded-lg md:text-md text-sm font-mono text-foreground break-all"
                  title={shortenedUrl} 
                >
                  {shortenedUrl}
                </code>
                <Button 
                  onClick={copyToClipboard} 
                  variant="default" 
                  size="icon" 
                  className="shrink-0 md:w-12 md:h-12  bg-primary hover:bg-primary/80 text-primary-foreground"
                >
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
              <Link href={'/links'}>
                <p className='text-muted-foreground underline' >See full shorted links list</p>
              </Link>
            </div>
          )}
        </div>
        
        {/* Footer/Attribution */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          All links are processed securely and instantly.
        </p>
      </div>
    </main>
  );
}