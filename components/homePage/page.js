"use client"
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowRight, Check, Copy } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter 
} from '../ui/dialog' 
import api from '@/lib/api'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const HomePage = () => {
    // State for managing the modal and the resulting link
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [shortLink, setShortLink] = useState('')
    const [isCopied, setIsCopied] = useState(false)
    const [url , setUrl] = useState('')
    const t = useTranslations('shortPage') 
    const tError = useTranslations('errors')

    // Simulates the link shortening process
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          // You should add client-side URL validation here before the API call!
          // e.g., if (!isValidUrl(url)) { return toast.error(t('validationError')) }

          const res = await api.post('/url/short' , {url})
          if(res.status === 201) {
            setShortLink(res.data.shortUrl) 
            setIsModalOpen(true)
            setIsCopied(false) 
          }
        }
        catch (err) {
          // **CRITICAL FIX**: Handle cases where err.response or err.response.data might be missing
          const errorMessageKey = err.response?.data?.message || 'unknownError';
          toast.error(tError(errorMessageKey));
        }
    }

    // Function to handle copying the URL
    const handleCopy = () => {
        if (navigator.clipboard && shortLink) {
            navigator.clipboard.writeText(shortLink).then(() => {
                setIsCopied(true)
                // Using the key from the 'general' namespace in your JSON structure
                toast.success(t('general.linkCopied')) 
                setTimeout(() => setIsCopied(false), 2000) 
            }).catch(err => {
                // Log the failure, but don't crash
                console.error("Copy failed:", err)
            })
        }
    }

    return (
        <>
            {/* --- MAIN PAGE CONTENT --- */}
            <div className='flex flex-col gap-10 items-center justify-center screen-h p-4 bg-gradient-to-b from-white via-white to-primary/50'>
              
                {/* TRANSLATED TITLE */}
                <h1 className='text-6xl font-extrabold tracking-tight sm:text-7xl'>
                    {t('title')}
                </h1>
                {/* TRANSLATED SUBTITLE */}
                <p className='text-xl text-gray-400 max-w-2xl text-center font-light'>
                    {t('subtitle')}
                </p>
                
                <form onSubmit={handleSubmit} className='relative flex w-full max-w-2xl mt-4 shadow-2xl rounded-xl overflow-hidden'>
                    <Input 
                        className='flex-grow md:h-16 h-14 pl-6 pr-20 text-lg border-none 
                                   -0 transition-all' 
                        // TRANSLATED PLACEHOLDER
                        placeholder={t('placeholder')} 
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    
                    <Button 
                        className='absolute right-0 top-0 h-full md:w-20 w-14 
                                   bg-primary hover:bg-primary/90 transition-colors 
                                   rounded-none flex items-center justify-center'
                        type='submit' 
                    >
                        <ArrowRight className='w-6 h-6' />
                    </Button>
                </form>

                {/* TRANSLATED PROMPT */}
                <p className='text-sm text-gray-500 mt-2'>
                    {t('readyPrompt')}
                </p>
            </div>

            {/* --- SHADCN DIALOG (MODAL) --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px] ">
                    <DialogHeader>
                        {/* TRANSLATED MODAL TITLE */}
                        <DialogTitle className="text-2xl text-green-400 flex items-center">
                            <Check className='w-6 h-6 mr-2' /> {t('modalTitle')}
                        </DialogTitle>
                        {/* TRANSLATED MODAL DESCRIPTION */}
                        <DialogDescription className="text-gray-400">
                            {t('modalDesc')}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Short Link Display remains the same */}
                    <div className="flex items-center space-x-2 mt-4">
                        <div className="grid flex-1 gap-2">
                            <Input
                                id="short-url"
                                defaultValue={shortLink}
                                readOnly
                                className="col-span-3  font-mono text-base"
                            />
                        </div>
                    </div>

                    <DialogFooter className='sm:justify-end  mt-4'>
                        <Button 
                            onClick={handleCopy} 
                            className={`w-full py-2 text-lg font-semibold transition-colors ${
                                isCopied 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-primary/95 hover:bg-primary'
                            }`}
                        >
                            {isCopied ? (
                                <>
                                    <Check className='w-5 h-5 mr-2' /> {t('copiedButton')}
                                </>
                            ) : (
                                <>
                                    <Copy className='w-5 h-5 mr-2' /> {t('copyButton')}
                                </>
                            )}
                        </Button>
                       
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default HomePage