import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  BarChart3,
  CheckCircle, // New icon for Active
  XCircle, // New icon for Inactive/Expired
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const LinkCard = ({ link }) => {
  const [copied, setCopied] = useState(false);

  // NOTE: You should get this from a hook or context, not process.env in a component.
  const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://turbolink.superstuff.online";

  const formatCreationDate = (dateString) => {
    // ... (formatCreationDate function remains the same)
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

  const getClickPercentage = () => {
    if (!link.max_clicks) return null;
    return Math.round((link.clicks / link.max_clicks) * 100);
  };

  const clickPercentage = getClickPercentage();

  // --- NEW STATUS LOGIC ---
  const isExpired = link.expires_at && new Date(link.expires_at) < new Date();
  const isActive = link.is_active === false ? false : true && !isExpired;

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-destructive/10 text-destructive rounded-full font-medium">
          <XCircle className="w-3 h-3" />
          Expired
        </span>
      );
    }
    if (!isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-destructive/10 text-destructive rounded-full font-medium">
          <XCircle className="w-3 h-3" />
          Inactive
        </span>
      );
    }
    // Only show "Active" if other status badges (like Protected or Max Clicks) aren't dominating the space.
    // However, for consistency, let's include it.
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full font-medium">
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    );
  };
  // --- END NEW STATUS LOGIC ---

  return (
    <div className="group relative bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Progress bar for click limit */}
      {link.max_clicks && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div 
            className={`h-full transition-all duration-300 ${
              clickPercentage >= 90 ? 'bg-destructive' : 
              clickPercentage >= 70 ? 'bg-yellow-500' : 
              'bg-primary'
            }`}
            style={{ width: `${clickPercentage}%` }}
          />
        </div>
      )}

      {/* Card Content - uses padding to account for the progress bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 pt-5 sm:pt-4"> 
        {/* Icon Section */}
        <div className="flex-shrink-0 relative">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <LinkIcon className="w-6 h-6 text-primary" />
          </div>
          {link.password && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-sm">
              <Lock className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-2">
          
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate">
                {link.short_url}
              </h3>
            </div>
            
            {/* Mobile Dropdown Menu (Secondary Actions) */}
            <div className="flex sm:hidden items-center gap-1 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link href={`links/edit/${link.short_url}`}>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit Link</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>View Analytics</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <EyeOff className="mr-2 h-4 w-4" />
                    <span>Hide Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Link</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Destination URL */}
          <a 
            href={link.original_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group/link max-w-full"
          >
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{link.original_url}</span>
          </a>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground pt-1">
            
            {/* --- LINK STATUS BADGE (NEW) --- */}
            {getStatusBadge()}
            {/* -------------------------------- */}

            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatCreationDate(link.createdAt)}
            </span>
            
            <span className="flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              {link.clicks || 0} {link.clicks === 1 ? 'click' : 'clicks'}
            </span>

            {link.password && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full font-medium">
                <Lock className="w-3 h-3" />
                Protected
              </span>
            )}

            {link.max_clicks && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                clickPercentage >= 90 ? 'bg-destructive/10 text-destructive' :
                clickPercentage >= 70 ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                'bg-primary/10 text-primary'
              }`}>
                <MousePointerClick className="w-3 h-3" />
                {clickPercentage}% used
              </span>
            )}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={copyToClipboard}
            className="h-9"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1.5" />
                Copy
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleVisitLink}
            className="h-9"
          >
            <ExternalLink className="w-4 h-4 mr-1.5" />
            Visit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href={`links/edit/${link.short_url}`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit Link</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>View Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <EyeOff className="mr-2 h-4 w-4" />
                <span>Hide Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Dedicated Mobile Action Bar */}
      <div className="flex sm:hidden justify-between gap-2 p-4 pt-0">
        <Button
          size="sm"
          onClick={copyToClipboard}
          className="flex-1 h-9"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1.5" />
              Copy URL
            </>
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleVisitLink}
          className="flex-1 h-9"
        >
          <ExternalLink className="w-4 h-4 mr-1.5" />
          Visit Link
        </Button>
      </div>
      
      {/* High Performance Badge */}
      {link.clicks > 100 && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md shadow-sm">
          🔥 Popular
        </div>
      )}
    </div>
  );
};

export default LinkCard;