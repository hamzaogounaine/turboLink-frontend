import { Button } from '@/components/ui/button'
import { Clock, Link } from 'lucide-react'
import React from 'react'

const LinkCard = ({ link }) => {
    const formatCreationDate = (dateString) => {
        if (!dateString) {
            // Return a sensible fallback if the input is trash
            return 'N/A';
        }
    
        try {
            const date = new Date(dateString);
    
            // Options for robust, localized output
            const options = {
                year: 'numeric',
                month: 'short', // e.g., "May"
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true, // Use AM/PM format
            };
    
            // Use the user's locale (defaulting to 'en-US' if necessary)
            // This is robust because it automatically handles time zones and localization.
            return new Intl.DateTimeFormat(navigator.language, options).format(date);
    
        } catch (error) {
            // Log the error for debugging and provide a neutral fallback
            console.error("Failed to parse date:", dateString, error);
            return 'Invalid Date';
        }
    }
  return (
    // 1. **Card Container**: Add padding, border, subtle shadow, and rounded corners
    //    to make it look like a distinct card. Use a light hover effect.
    <div className='flex items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 bg-white mb-3'>
      
      {/* 2. **Icon Section**: Fixed width for visual consistency, centered icon. */}
      <div className='flex-shrink-0 w-12 flex justify-center items-center'>
        <Link className='w-6 h-6 text-primary' /> {/* Use a color for emphasis */}
      </div>

      {/* 3. **Link Details**: Use `flex-grow` to take up available space and justify content */}
      <div className='flex-grow mx-4'> 
        {/* Use a font weight for the main URL */}
        <p className='text-lg font-semibold text-gray-800 truncate'>{link.short_url}</p>
        {/* Use proper color for secondary/muted text */}
        <p className='text-sm text-gray-500 mt-0.5 flex gap-2 items-center' ><Clock size={15} /> {formatCreationDate(link.created_at)}</p>
      </div>

      {/* 4. **Action Buttons**: Use `flex-shrink-0` to keep buttons together, add spacing. */}
      <div className='flex gap-2.5 flex-shrink-0'>
        <Button size="sm">Edit</Button>
        <Button size="sm" variant={'destructive'}>Delete </Button>
        {/* 'Hide' is a secondary action, use a 'ghost' variant if available, otherwise outline/secondary */}
        <Button size="sm" variant={'secondary'}>Hide</Button> 
      </div>
    </div>
  )
}

export default LinkCard