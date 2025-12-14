// src/app/links/[short_url]/EditLinkPage.jsx
"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Data and Logic

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Icons
import { Loader2, XCircle, ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import LinkAnalyticsCard from "./LinkAnalyticsCard";
import LinkEditForm from "./LinkEditForm";
import { BASE_URL, useLinkData } from "./useLinkData";
import { useState } from "react";

const EditLinkPage = ({ short_url }) => {
  const router = useRouter();
  const t = useTranslations("editLinksPage");
  const [copied, setCopied] = useState(false);
  
  // Custom Hook for Data
  const { link, error, isLoading, mutate } = useLinkData(short_url);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${BASE_URL}/${link.short_url}`);
    setCopied(true);
    toast.success(t("toast_copy_success"));
    setTimeout(() => setCopied(false), 2000);
  };
  
  // --- RENDER STATES ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          {t("loading_data")}
        </p>
      </div>
    );
  }

  if (error || !link) {
    const displayError =
      error?.response?.data?.message || t("loading_error_default", { short_url });

    return (
      <div className="min-h-screen bg-background flex items-center justify-center ">
        <Card className="max-w-lg w-full border-destructive/50 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {t("error_title")}
            </CardTitle>
            <CardDescription className="text-base">
              {displayError}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => router.push("/links")}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("error_go_back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Form Render
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto  py-6 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {t("header_title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("header_description")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/links")}
              className="self-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("error_go_back")}
            </Button>
          </div>

          {/* Short URL Display Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {t("label_short_link")}
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-foreground truncate font-mono">
                    {BASE_URL}/{link.short_url}
                  </p>
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant=""
                  size="sm"
                  className="self-start sm:self-auto shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t("button_copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      {t("button_copy_link")}
                    </>
                  )}
                </Button>
                {/* Optional: Add button to visit link */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="self-start sm:self-auto shrink-0"
                >
                  <a href={`${BASE_URL}/${link.short_url}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("button_visit")}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <LinkEditForm 
              link={link} 
              short_url={short_url} 
              mutate={mutate} 
              BASE_URL={BASE_URL}
            />
          </div>

          {/* Right Column - Analytics & Info */}
          <LinkAnalyticsCard link={link} />
        </div>
      </div>
    </div>
  );
};

export default EditLinkPage;