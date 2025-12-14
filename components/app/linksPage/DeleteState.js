import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Trash2, XCircle } from "lucide-react";
  import React from "react";
  import { toast } from "sonner";
import api from "@/lib/api";
  
  /**
   * Renders a confirmation dialog for deleting a link using the standard Dialog component.
   * @param {object} props
   * @param {boolean} props.isOpen - Controls the visibility of the dialog.
   * @param {function} props.onOpenChange - Callback to change the dialog state.
   * @param {object} props.link - The link object being deleted.
   * @param {function} props.onDelete - The function to call when the user confirms deletion.
   */
  const DeleteLinkDialog = ({ isOpen, onOpenChange, link, onDelete , mutate }) => {
    
    const handleConfirmDelete = async () => {
      // Dismiss the dialog immediately
      onOpenChange(false); 
      
      // Perform the actual deletion logic 
      try {
        // await onDelete(link.short_url); // Uncomment and implement actual delete function
        const res = await api.post(`/url/delete/${link.short_url}`)
  
        if(res.status  === 200) {
            mutate()
            toast.success("Link deleted successfully.", {
                description: `The short URL ${link.short_url} is now permanently gone.`,
                icon: <XCircle className="w-4 h-4 text-red-500" />,
            });
        }
  
      } catch (error) {
        // ERROR notification
        toast.error("Deletion failed.", {
          description: "Could not delete the link. Please try again.",
        });
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {/* We use DialogContent. The backdrop close behavior is the main difference from AlertDialog. */}
        <DialogContent className="sm:max-w-[425px]"> 
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <Trash2 className="mr-2 h-5 w-5" />
              Permanently Delete Link?
            </DialogTitle>
            <DialogDescription>
              You are about to delete the short link: 
              <span className="font-semibold text-foreground block mt-1">
                  {link.short_url}
              </span>
              <blockquote className="mt-2 border-l-2 pl-4 italic text-muted-foreground">
                  Original URL: {link.redirect_url}
              </blockquote>
            </DialogDescription>
            <DialogDescription className="mt-4 font-bold text-sm">
              <span className="text-destructive">Warning:</span> This action cannot be undone. All associated click data and settings will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} // Use onOpenChange to close
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              variant="destructive" 
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto"
            >
              Yes, Delete It Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default DeleteLinkDialog;