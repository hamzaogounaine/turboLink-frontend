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
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
  MousePointerClick,
  Lock,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const LinkCard = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://turbolink.superstuff.online";

  const formatCreationDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      const options = { month: "short", day: "numeric", year: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } catch (error) {
      console.error("Failed to parse date:", dateString, error);
      return "Invalid Date";
    }
  };

  const copyToClipboard = () => {
    const fullUrl = `${BASE_URL}/${link.short_url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisitLink = () => {
    window.open(`${BASE_URL}/${link.short_url}`, '_blank');
  };

  return (
    <div
      className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 
                 rounded-2xl border border-gray-200 hover:border-indigo-300 
                 hover:shadow-lg bg-white transition-all duration-300 
                 hover:scale-[1.01] mb-4"
    >
      {/* Gradient Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 
                      rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon Section with Badge */}
      <div className="flex-shrink-0 relative">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 
                        flex items-center justify-center shadow-md group-hover:shadow-lg 
                        transition-shadow duration-300">
          <LinkIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        {link.password && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full 
                          flex items-center justify-center shadow-sm">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-grow min-w-0 space-y-2">
        {/* Short URL - Primary */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {link.short_url}
          </h3>
          {link.max_clicks && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 
                           bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              <MousePointerClick className="w-3 h-3" />
              {link.clicks || 0}/{link.max_clicks}
            </span>
          )}
        </div>

        {/* Destination URL */}
        <a 
          href={link.original_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 
                     hover:underline truncate group/link max-w-full"
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{link.original_url}</span>
        </a>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {formatCreationDate(link.createdAt)}
          </span>
          
          <span className="flex items-center gap-1.5 font-semibold text-indigo-600">
            <TrendingUp className="w-3.5 h-3.5" />
            {link.clicks || 0} {link.clicks === 1 ? 'click' : 'clicks'}
          </span>

          {link.password && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 
                           rounded-full text-xs font-medium">
              <Lock className="w-3 h-3" />
              Protected
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:flex-shrink-0 self-start sm:self-center">
        {/* Copy Button - Primary Action */}
        <Button
          size="sm"
          onClick={copyToClipboard}
          className={`${
            copied 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          } transition-all duration-200 shadow-md hover:shadow-lg`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </Button>

        {/* Visit Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleVisitLink}
          className="border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
        >
          <ExternalLink className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden md:inline">Visit</span>
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 hover:bg-gray-100 border border-transparent 
                         hover:border-gray-200 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <Link href={`links/edit/${link.short_url}`}>
              <DropdownMenuItem className="text-sm cursor-pointer hover:bg-indigo-50">
                <Pencil className="mr-2 h-4 w-4 text-indigo-600" />
                <span>Edit Link</span>
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuItem className="text-sm cursor-pointer hover:bg-gray-50">
              <EyeOff className="mr-2 h-4 w-4 text-gray-600" />
              <span>Hide Link</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="text-sm cursor-pointer text-red-600 
                         hover:bg-red-50 focus:text-red-700 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Performance Indicator */}
      {link.clicks > 100 && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 
                        px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 
                        text-white text-xs font-bold rounded-full shadow-md">
          🔥 Popular
        </div>
      )}
    </div>
  );
};

export default LinkCard;