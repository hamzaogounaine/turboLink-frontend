import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import {
  Clock,
  
  MoreVertical,
  Pencil,
  Trash2,
  EyeOff,
} from "lucide-react";
import React from "react";

const LinkCard = ({ link }) => {
  // This date formatting is fine, but for a modern look, consider a dedicated
  // utility or a simpler, more human-readable format (e.g., "3 days ago")
  const formatCreationDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      // Use 'default' locale for consistent look, or let it localize
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } catch (error) {
      console.error("Failed to parse date:", dateString, error);
      return "Invalid Date";
    }
  };

  // Modern design is all about fewer borders and more focused interaction.
  // The hover effect is more pronounced to draw attention.
  return (
    <div
      className="flex items-center p-4 rounded-xl border border-transparent 
                        hover:border-primary/20 hover:bg-gray-50 transition-all 
                        duration-200 bg-white mb-3 shadow-sm"
    >
      {/* 1. Icon/Status Section: Smaller, subtle indicator */}
      <div className="flex-shrink-0 w-8 flex justify-center items-center">
        <Link className="w-5 h-5 text-indigo-500" />
      </div>

      {/* 2. Link Details: Focus on the truncated short URL */}
      <div className="flex-grow mx-4 min-w-0">
        {/* Short URL: Primary focus, larger, bold, using a modern font color */}
        <p className="text-lg font-bold text-gray-900 truncate tracking-tight">
          {link.short_url}
        </p>

        {/* Original URL: Subtle, secondary info */}
        <p className="text-sm text-indigo-500/80 truncate mt-0.5">
          {link.original_url}
        </p>

        {/* Date/Stats: Muted text, good iconography */}
        <div className="text-xs text-gray-500 mt-1 flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-gray-400" />
            Created: {formatCreationDate(link.createdAt)}
          </span>
          {/* Add a placeholder for Clicks/Views, which is critical data! */}
          <span className="font-medium text-gray-600">
            {/* Replace with actual click data */}
            {link.clicks || 0} Clicks
          </span>
        </div>
      </div>

      {/* 3. Action Buttons: Clean up the clutter with a Dropdown Menu */}
      <div className="flex-shrink-0">
        {/* The primary action button: Copy Link. This is the most common action. */}
        <Button size="sm" className="mr-2 bg-primary hover:bg-primary/90">
          Copy Link
        </Button>

        {/* Secondary actions in a clean menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <Link href={`links/edit/${link.short_url}`}>
            <DropdownMenuItem className="text-sm">
                <Pencil size={16} className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
              </Link>
            <DropdownMenuItem className="text-sm">
              <EyeOff size={16} className="mr-2 h-4 w-4" /> Hide
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-red-600 focus:text-white focus:bg-red-600">
              <Trash2 size={16} className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LinkCard;
