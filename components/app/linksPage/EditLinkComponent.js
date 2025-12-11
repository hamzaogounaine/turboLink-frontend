"use client"
import useSWR from 'swr'
import api from '@/lib/api'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card' 
import { Loader2, Save, XCircle, Lock, MousePointerClick, Calendar, ExternalLink, Copy, Check, ArrowLeft, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch' 
import { useTranslations } from 'next-intl'


const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
}

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://turbolink.superstuff.online" 

const EditLinkPage = ({ short_url }) => {
    const router = useRouter()
    const t = useTranslations('editLinksPage')
    const [copied, setCopied] = useState(false)

    const { 
        data: link, 
        error, 
        isLoading, 
        mutate 
    } = useSWR(`/url/${short_url}`, fetcher)

    const [formData, setFormData] = useState({ 
        short_url: '', 
        redirect_url: '',
        password: '', 
        max_clicks: null, 
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState(null)
    const [showPasswordField, setShowPasswordField] = useState(null)
    
    // Initialize Form State
    useEffect(() => {
        if (link) {
            setFormData({
                short_url: link.short_url,
                redirect_url: link.redirect_url,
                password: '', 
                max_clicks: link.max_clicks ?? '', 
            })
            if (link.password) {
                setShowPasswordField(true);
            }
        }
    }, [link])

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'max_clicks') {
            const numValue = value === '' ? null : parseInt(value, 10);
            setFormData(prev => ({ 
                ...prev, 
                [name]: isNaN(numValue) || numValue < 0 ? null : numValue 
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${BASE_URL}/${link.short_url}`)
        setCopied(true)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError(null)

        if (!formData.redirect_url || !formData.short_url) {
            setFormError(t('form_error_required_fields'))
            setIsSubmitting(false)
            return
        }
        
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) {
            delete dataToSubmit.password;
        }

        try {
            const response = await api.put(`/url/${short_url}`, dataToSubmit)
            toast.success(t('toast_success'), { duration: 4000 })
            mutate(response.data) 
        } catch (err) {
            const message = err.response?.data?.message || t('form_error_server_default')
            setFormError(message)
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    // --- RENDER STATES ---
    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center p-8 min-h-screen bg-background'>
                <Loader2 className='w-12 h-12 animate-spin text-primary' />
                <p className='mt-4 text-sm font-medium text-muted-foreground'>{t('loading_data')}</p>
            </div>
        )
    }

    if (error || !link) {
        const displayError = formError || error?.response?.data?.message || t('loading_error_default', { short_url });

        return (
            <div className='min-h-screen bg-background flex items-center justify-center p-4'>
                <Card className="max-w-lg w-full border-destructive/50 shadow-lg">
                    <CardHeader className='text-center space-y-4'>
                        <div className='mx-auto w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center'>
                            <XCircle className='w-8 h-8 text-destructive' />
                        </div>
                        <CardTitle className='text-2xl font-bold'>{t('error_title')}</CardTitle>
                        <CardDescription className='text-base'>
                            {displayError}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='text-center'>
                        <Button 
                            onClick={() => router.push('/links')} 
                            variant="secondary"
                            className='w-full sm:w-auto'
                        >
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            {t('error_go_back')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    // Main Form Render
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className='mb-6'>
                    <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6'>
                        <div className='space-y-1'>
                            <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                                {t('header_title')}
                            </h1>
                            <p className='text-sm text-muted-foreground'>
                                {t('header_description')}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/links')}
                            className='self-start'
                        >
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Back to Links
                        </Button>
                    </div>

                    {/* Short URL Display Card */}
                    <Card className='border-primary/20 bg-primary/5'>
                        <CardContent className='p-4 sm:p-5'>
                            <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs font-medium text-muted-foreground mb-1.5'>Your Short Link</p>
                                    <p className='text-base sm:text-lg font-semibold text-foreground truncate font-mono'>
                                        {BASE_URL}/{link.short_url}
                                    </p>
                                </div>
                                <Button
                                    onClick={copyToClipboard}
                                    variant="secondary"
                                    size="sm"
                                    className='self-start sm:self-auto shrink-0'
                                >
                                    {copied ? (
                                        <>
                                            <Check className='w-4 h-4 mr-2' />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className='w-4 h-4 mr-2' />
                                            Copy Link
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    
                    {/* Left Column - Form */}
                    <div className='lg:col-span-2'>
                        <Card>
                            <CardHeader className='border-b'>
                                <CardTitle>Configuration</CardTitle>
                                <CardDescription>Update your link settings and preferences</CardDescription>
                            </CardHeader>
                            <CardContent className='p-6'>
                                <div className='space-y-6'>
                                    
                                    {/* Destination URL */}
                                    <div className="space-y-2">
                                        <Label htmlFor="redirect_url" className='text-sm font-medium'>
                                            Destination URL
                                        </Label>
                                        <div className='relative'>
                                            <ExternalLink className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                                            <Input
                                                id="redirect_url"
                                                name="redirect_url"
                                                type="url"
                                                value={formData.redirect_url}
                                                onChange={handleChange}
                                                required
                                                placeholder='https://example.com/destination'
                                                className='pl-10 font-mono text-sm h-10'
                                            />
                                        </div>
                                        <p className='text-xs text-muted-foreground'>
                                            The URL where visitors will be redirected
                                        </p>
                                    </div>

                                    {/* Advanced Settings */}
                                    <div className="pt-4 space-y-5">
                                        <div className='flex items-center gap-2'>
                                            <h3 className='text-sm font-semibold text-foreground'>Advanced Settings</h3>
                                            <div className='h-px flex-1 bg-border'></div>
                                        </div>

                                        {/* Max Clicks */}
                                        <div className="space-y-2">
                                            <Label htmlFor="max_clicks" className='text-sm font-medium'>
                                                Click Limit
                                            </Label>
                                            <div className='relative'>
                                                <MousePointerClick className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                                                <Input
                                                    id="max_clicks"
                                                    name="max_clicks"
                                                    type="number"
                                                    min="1"
                                                    value={formData.max_clicks ?? ''}
                                                    onChange={handleChange}
                                                    placeholder='Unlimited'
                                                    className='pl-10 h-10'
                                                />
                                            </div>
                                            <p className='text-xs text-muted-foreground'>
                                                Maximum number of clicks before the link expires
                                            </p>
                                        </div>

                                        {/* Password Protection */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-9 h-9 bg-primary/10 rounded-md flex items-center justify-center'>
                                                        <Lock className='w-4 h-4 text-primary' />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="password_toggle" className='text-sm font-medium cursor-pointer'>
                                                            Password Protection
                                                        </Label>
                                                        <p className='text-xs text-muted-foreground'>Require password to access link</p>
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
                                                    <Label htmlFor="password" className='text-sm font-medium'>
                                                        Password
                                                    </Label>
                                                    <Input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder='Enter a secure password'
                                                        className='h-10'
                                                    />
                                                    <p className='text-xs text-muted-foreground'>
                                                        Leave empty to keep the current password unchanged
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Error Display */}
                                    {formError && (
                                        <div className='flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm'>
                                            <XCircle className='w-4 h-4 shrink-0 mt-0.5' />
                                            <div className='flex-1'>
                                                <p className='font-medium mb-0.5'>Error</p>
                                                <p className='text-destructive/90'>{formError}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className='flex gap-3 pt-2'>
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/links')}
                                            className='flex-1'
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className='flex-1'
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Analytics & Info */}
                    <div className='space-y-6'>
                        
                        {/* Analytics Card */}
                        <Card>
                            <CardHeader className='border-b'>
                                <CardTitle className='text-base'>Statistics</CardTitle>
                                <CardDescription className='text-xs'>Link performance overview</CardDescription>
                            </CardHeader>
                            <CardContent className='p-6 space-y-4'>
                                
                                {/* Total Clicks */}
                                <div className='space-y-1'>
                                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                        <MousePointerClick className='w-3.5 h-3.5' />
                                        <span>Total Clicks</span>
                                    </div>
                                    <p className='text-3xl font-bold text-foreground tabular-nums'>{link.clicks || 0}</p>
                                    {formData.max_clicks && (
                                        <p className='text-xs text-muted-foreground'>
                                            of {formData.max_clicks} limit
                                        </p>
                                    )}
                                </div>

                                <div className='h-px bg-border'></div>

                                {/* Created Date */}
                                <div className='space-y-1'>
                                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                        <Calendar className='w-3.5 h-3.5' />
                                        <span>Created</span>
                                    </div>
                                    <p className='text-sm font-medium text-foreground'>
                                        {new Date(link.createdAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>

                                <div className='h-px bg-border'></div>

                                {/* Status Indicators */}
                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between text-sm'>
                                        <span className='text-muted-foreground'>Password</span>
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                                            link.password 
                                                ? 'bg-green-500/10 text-green-700 dark:text-green-400' 
                                                : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {link.password ? 'Protected' : 'None'}
                                        </span>
                                    </div>
                                    <div className='flex items-center justify-between text-sm'>
                                        <span className='text-muted-foreground'>Click Limit</span>
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                                            link.max_clicks 
                                                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' 
                                                : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {link.max_clicks || 'Unlimited'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info Card */}
                        <Card className='border-muted-foreground/20'>
                            <CardContent className='p-4'>
                                <div className='flex items-start gap-3'>
                                    <div className='w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center shrink-0'>
                                        <Info className='w-4 h-4 text-primary' />
                                    </div>
                                    <div className='text-xs text-muted-foreground space-y-1'>
                                        <p className='font-medium text-foreground'>Quick Tips</p>
                                        <ul className='space-y-1 list-disc list-inside'>
                                            <li>Password protection adds security</li>
                                            <li>Click limits help control access</li>
                                            <li>Changes are saved immediately</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditLinkPage