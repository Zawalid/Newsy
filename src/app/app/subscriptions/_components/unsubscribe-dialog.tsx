'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UnsubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: UserSubscriptionWithNewsletter | null;
  onConfirm: () => void;
  selectedCount?: number;
}

export function UnsubscribeDialog({
  open,
  onOpenChange,
  subscription,
  onConfirm,
  selectedCount = 0,
}: UnsubscribeDialogProps) {
  const isBulkAction = subscription === null && selectedCount > 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isBulkAction 
              ? `Unsubscribe from ${selectedCount} newsletters?` 
              : `Unsubscribe from ${subscription?.newsletter.name}?`}
          </DialogTitle>
          <DialogDescription>
            {isBulkAction
              ? "This will unsubscribe you from all selected newsletters. This action cannot be undone."
              : "This will unsubscribe you from this newsletter. You can always resubscribe later."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Unsubscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}