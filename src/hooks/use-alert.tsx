"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AlertOptions = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
};

export function useAlert() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<AlertOptions>({
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {},
  });

  const showAlert = (alertOptions: AlertOptions) => {
    setOptions({ ...options, ...alertOptions });
    setIsOpen(true);
  };

  const AlertComponent = React.useCallback(() => {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{options.cancelText}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await options.onConfirm();
                setIsOpen(false);
              }}
            >
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }, [isOpen, options]);

  return {
    showAlert,
    AlertComponent,
  };
}
