"use client"
import useSWR from 'swr'
import api from '@/lib/api'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card' 
import { Loader2, CheckCircle, Save, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch' // Assuming you have a Switch component for toggling password visibility/setting

const fetcher = async (url) => {
    const res = await api.get(url)
    return res.data
}

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://turbolink.superstuff.online" 

const EditLinkPage = ({ short_url }) => {
    const router = useRouter()
    
    const { 
        data: link, 
        error, 
        isLoading, 
        mutate 
    } = useSWR(`/url/${short_url}`, fetcher)

    // State updated to include new fields: password (string) and max_clicks (number/string)
    const [formData, setFormData] = useState({ 
        short_url: '', 
        redirect_url: '',
        // Use an empty string for password until the user decides to change it
        password: '', 
        // Use null or undefined if the limit is not set, otherwise the numeric value
        max_clicks: null, 
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState(null)
    const [showPasswordField, setShowPasswordField] = useState(short_url?.password ?? true)
    
    // Initialize Form State
    useEffect(() => {
        if (link) {
            setFormData({
                short_url: link.short_url,
                redirect_url: link.redirect_url,
                // Do NOT pre-fill the password for security reasons.
                password: '', 
                // Set max_clicks if it exists, otherwise keep it null/empty string for the input
                max_clicks: link.max_clicks ?? '', 
            })
            // If the link already has a password, show the field to allow changing it
            if (link.password_protected) {
                setShowPasswordField(true);
            }
        }
    }, [link])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle number input for max_clicks (convert to number or null/undefined)
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError(null)

        if (!formData.redirect_url || !formData.short_url) {
            setFormError('Both the short URL and destination URL fields are required.')
            setIsSubmitting(false)
            return
        }
        
        // Prepare data for API: Clean up empty password if the field is visible but empty
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) {
            delete dataToSubmit.password;
        }

        try {
            // NOTE: The API MUST handle the logic for deleting the existing password 
            // if the user submits an empty password field when password_protected was true.
            const response = await api.put(`/url/${short_url}`, dataToSubmit)
            
            toast.success("updated successfully",
                { duration: 4000 }
            )
            
            mutate(response.data) 
            
        } catch (err) {
            const message = err.response?.data?.message || 'Update failed due to a server error.'
            setFormError(message)
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    // --- RENDER STATES (Unchanged) ---
    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center p-12 min-h-screen'>
                <Loader2 className='w-8 h-8 animate-spin text-indigo-500' />
                <p className='mt-3 text-lg font-medium text-gray-500'>Loading link data...</p>
            </div>
        )
    }

    if (error || !link) {
        return (
            <Card className="max-w-xl mx-auto mt-10 border-red-300">
                <CardHeader className='text-center'>
                    <XCircle className='w-10 h-10 mx-auto text-red-500' />
                    <CardTitle className='text-2xl text-red-800'>Link Not Found</CardTitle>
                    <CardDescription className='text-red-600'>
                        {formError || error?.response?.data?.message || `The link with ID ${short_url} could not be loaded.`}
                    </CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                    <Button onClick={() => router.push('/links')} variant="secondary">
                        Go Back to Links
                    </Button>
                </CardContent>
            </Card>
        )
    }
    
    // 6. **Main Form Render**
    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
            
            <div className="w-full max-w-2xl 
                            md:shadow-xl md:rounded-xl md:mt-10 md:mb-10 
                            ">

                <header className='p-4 md:p-6 border-b'>
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                        Edit Link: <span className='text-indigo-600'>{link.short_url}</span>
                    </h1>
                    <p className='text-sm text-gray-500 md:text-base'>
                        Update the destination URL or change the short link slug.
                    </p>
                </header>

                <div className='p-4 md:p-6'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        
                        {/* --- PRIMARY FIELDS --- */}
                        <div className="space-y-2">
                            <Label htmlFor="short_url">Short Link Slug</Label>
                            <div className='flex items-center space-x-2'>
                                <span className='text-gray-500 whitespace-nowrap'>{BASE_URL}/</span> 
                                <Input 
                                    id="short_url" 
                                    name="short_url"
                                    type="text"
                                    value={formData.short_url}
                                    onChange={handleChange}
                                    required
                                    className='flex-grow font-mono'
                                    placeholder='my-awesome-link'
                                    readOnly
                                    disabled
                                />
                            </div>
                            <p className='text-xs text-gray-500'>
                                Changing this will break existing links.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="redirect_url">Destination URL</Label>
                            <Input
                                id="redirect_url"
                                name="redirect_url"
                                type="url"
                                value={formData.redirect_url}
                                onChange={handleChange}
                                required
                                placeholder='https://www.the-actual-site.com/long-page'
                                className='font-mono'
                            />
                        </div>

                        {/* --- NEW OPTIONAL SETTINGS SECTION --- */}
                        <div className="pt-6 border-t space-y-4">
                            <h2 className='text-lg font-semibold text-gray-800'>Advanced Settings</h2>

                            {/* MAX CLICKS INPUT */}
                            <div className="space-y-2">
                                <Label htmlFor="max_clicks">Max Clicks Limit</Label>
                                <Input
                                    id="max_clicks"
                                    name="max_clicks"
                                    type="number"
                                    min="1"
                                    value={formData.max_clicks ?? ''} // Use empty string for display when null
                                    onChange={handleChange}
                                    placeholder='e.g., 100 (Leave blank for unlimited)'
                                />
                                <p className='text-xs text-gray-500'>
                                    The link will deactivate automatically after this many clicks.
                                </p>
                            </div>

                            {/* PASSWORD TOGGLE/INPUT */}
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password_toggle">Password Protection</Label>
                                    <Switch
                                        checked={showPasswordField}
                                        onCheckedChange={setShowPasswordField}
                                        id="password_toggle"
                                    />
                                </div>
                                
                                {showPasswordField && (
                                    <div className="space-y-2 mt-2">
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder='Enter new password or leave blank to keep current'
                                        />
                                        <p className='text-xs text-gray-500'>
                                            Submit with a new password to change it, or submit blank to remove protection.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Analytics/Read-only Data */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t mt-6">
                            <div className='text-sm'>
                                <p className='font-medium text-gray-600'>Total Clicks</p>
                                <p className='text-2xl font-bold text-indigo-700'>{link.clicks || 0}</p>
                            </div>
                            <div className='text-sm'>
                                <p className='font-medium text-gray-600'>Created On</p>
                                <p className='text-base text-gray-700'>
                                    {new Date(link.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Submission Button and Error Display */}
                        {formError && (
                            <div className='p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm'>
                                **Error:** {formError}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 mt-4" 
                            disabled={isSubmitting || isLoading}
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
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditLinkPage