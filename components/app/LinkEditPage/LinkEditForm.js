// src/components/links/LinkEditForm.jsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import api from "@/lib/api";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// Icons
import { Loader2, Save, XCircle, ExternalLink, MousePointerClick, Lock, Check, Copy, ArrowLeft } from "lucide-react";

const initialFormState = {
    short_url: "",
    redirect_url: "",
    password: "",
    max_clicks: null,
    is_active: true,
};

const LinkEditForm = ({ link, short_url, mutate, BASE_URL }) => {
    const router = useRouter();
    const t = useTranslations("editLinksPage");
    
    // State
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [showPasswordField, setShowPasswordField] = useState(false);
    
    // Initialization Effect
    useEffect(() => {
        if (link) {
            setFormData({
                short_url: link.short_url,
                redirect_url: link.redirect_url,
                password: "",
                max_clicks: link.max_clicks ?? "",
                is_active: link.is_active,
            });
            setShowPasswordField(!!link.password);
        }
    }, [link]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "max_clicks") {
            const numValue = value === "" ? null : parseInt(value, 10);
            setFormData((prev) => ({
                ...prev,
                [name]: (isNaN(numValue) || numValue < 0) ? null : numValue,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSwitchChange = async (checked) => {
        try {
          const res = await api.post(`url/disable/${link.short_url}` , {checked})
          mutate()
        }
        catch(err) {
          toast.error(err)
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${BASE_URL}/${link.short_url}`);
        setCopied(true);
        toast.success(t("toast_copy_success"));
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        if (!formData.redirect_url || !formData.short_url) {
            setFormError(t("form_error_required_fields"));
            setIsSubmitting(false);
            return;
        }

        const dataToSubmit = { ...formData };
        
        // Logic to remove or disable password
        if (!showPasswordField && !formData.password) {
            dataToSubmit.disable_password = true;
            delete dataToSubmit.password;
        } else if (formData.password === "") {
            delete dataToSubmit.password;
        }

        try {
            const response = await api.put(`/url/${short_url}`, dataToSubmit);
            toast.success(t("toast_success"), { duration: 4000 });
            mutate(response.data);
        } catch (err) {
            const message = err.response?.data?.message || t("form_error_server_default");
            setFormError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>{t("card_title_config")}</CardTitle>
                <CardDescription>{t("card_desc_config")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    
                    {/* Destination URL */}
                    <div className="space-y-2">
                        <Label htmlFor="redirect_url" className="text-sm font-medium">
                            {t("label_destination_url")}
                        </Label>
                        <div className="relative">
                            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="redirect_url"
                                name="redirect_url"
                                type="url"
                                value={formData.redirect_url}
                                onChange={handleChange}
                                required
                                placeholder="https://example.com/destination"
                                className="pl-10 font-mono text-sm h-10"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("desc_destination_url")}
                        </p>
                    </div>

                    {/* Link Status Switch (Improved) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="url_active_switch" className="text-base font-semibold">
                                    {t("label_link_status")}
                                </Label>
                                <p className="text-sm text-gray-500">
                                    {t("desc_link_status")}
                                </p>
                            </div>
                            <Switch 
                                id="url_active_switch" 
                                checked={formData.is_active} 
                                onCheckedChange={handleSwitchChange}
                                aria-label={t("aria_toggle_status")}
                            />
                        </div>

                        {formData.is_active ? (
                            <p className="text-xs font-medium text-green-600 border-l-2 border-green-500 pl-2 py-0.5">
                                {t("status_live")}
                            </p>
                        ) : (
                            <p className="text-xs font-medium text-red-600 border-l-2 border-red-500 pl-2 py-0.5">
                                {t("status_disabled")}
                            </p>
                        )}
                    </div>
                  
                    {/* Advanced Settings */}
                    <div className="pt-4 space-y-5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {t("heading_advanced_settings")}
                        </h3>
                        <div className="h-px flex-1 bg-border"></div>
                      </div>

                      {/* Max Clicks */}
                      <div className="space-y-2">
                        <Label htmlFor="max_clicks" className="text-sm font-medium">
                          {t("label_click_limit")}
                        </Label>
                        <div className="relative">
                          <MousePointerClick className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="max_clicks"
                            name="max_clicks"
                            type="number"
                            min="1"
                            value={formData.max_clicks ?? ""}
                            onChange={handleChange}
                            placeholder={t("placeholder_unlimited")}
                            className="pl-10 h-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t("desc_click_limit")}
                        </p>
                      </div>

                      {/* Password Protection */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary/10 rounded-md flex items-center justify-center">
                              <Lock className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <Label htmlFor="password_toggle" className="text-sm font-medium cursor-pointer">
                                {t("label_password_protection")}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {t("desc_password_protection")}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={showPasswordField}
                            onCheckedChange={setShowPasswordField}
                            id="password_toggle"
                          />
                        </div>

                        {showPasswordField && (
                          <div className="space-y-2 pl-1">
                            <Label htmlFor="password" className="text-sm font-medium">
                              {t("label_password")}
                            </Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder={t("placeholder_password")}
                              className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">
                              {t("desc_password_leave_empty")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error Display */}
                    {formError && (
                      <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium mb-0.5">{t("error_heading")}</p>
                          <p className="text-destructive/90">{formError}</p>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/links")}
                        className="flex-1"
                      >
                        {t("button_cancel")}
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("button_saving")}
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            {t("button_save_changes")}
                          </>
                        )}
                      </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LinkEditForm;