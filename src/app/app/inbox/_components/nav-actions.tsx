"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  CornerUpRight,
  MailOpen,
  MessageSquareDot,
  MoreHorizontal,
  Star,
  Trash2,
  UserMinus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useEmail } from "@/hooks/use-emails";
import { useEmailActions } from "@/hooks/use-email-actions";

export function NavActions() {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const { id } = useParams();
  const { email } = useEmail(id as string);
  const { markAsRead, markAsUnread, deleteEmail } = useEmailActions();


  if (!email) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56 p-2">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                if (email.isRead) markAsUnread(email.id);
                else markAsRead(email.id);
              }}
            >
              {email?.isRead ? (
                <MessageSquareDot className="mr-2" />
              ) : (
                <MailOpen className="mr-2" />
              )}
              {email?.isRead ? "Mark as unread" : "Mark as read"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <CornerUpRight className="mr-2" /> Move to
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <UserMinus className="mr-2" /> Unsubscribe
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>
              <Trash2 className="mr-2" /> Move to Trash
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move this email to trash?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                deleteEmail(email.id, true);
                setIsAlertOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
