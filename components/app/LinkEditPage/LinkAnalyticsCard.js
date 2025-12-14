// src/components/links/LinkAnalyticsCard.jsx
import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick, Calendar, Info } from "lucide-react";

// Note: This component assumes 'link' is passed as a prop from the parent
const LinkAnalyticsCard = ({ link }) => {
  const t = useTranslations("editLinksPage");

  return (
    <div className="space-y-6">
      {/* Statistics Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">{t("stats_title")}</CardTitle>
          <CardDescription className="text-xs">
            {t("stats_description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Total Clicks */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>{t("stats_total_clicks")}</span>
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {link.clicks || 0}
            </p>
            {link.max_clicks && (
              <p className="text-xs text-muted-foreground">
                of {link.max_clicks} limit
              </p>
            )}
          </div>

          <div className="h-px bg-border"></div>

          {/* Created Date */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t("stats_created")}</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {new Date(link.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="h-px bg-border"></div>

          {/* Status Indicators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("stats_password")}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  link.password
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {link.password ? t("stats_protected") : t("stats_none")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("stats_click_limit")}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  link.max_clicks
                    ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {link.max_clicks || t("stats_unlimited")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("stats_status")}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  link.is_active
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-red-500/10 text-red-700 dark:text-red-400"
                }`}
              >
                {link.is_active ? t("status_active") : t("status_inactive")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-muted-foreground/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{t("tips_title")}</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>{t("tip_password")}</li>
                <li>{t("tip_limit")}</li>
                <li>{t("tip_saved")}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkAnalyticsCard;