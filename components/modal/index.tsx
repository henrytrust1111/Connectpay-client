import * as React from "react";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/common-elements/dialog";
import { tailwindCn } from "@/helpers";

interface Props {
  title?: string;
  defaultOpen?: boolean;
  className?: string;
  showDialogClose?: boolean;
  overlayClass?: string;
  onClose?: (open?: boolean) => void;
  isOpen: boolean;
  children?: React.ReactNode;
}
export function Modal({
  title,
  isOpen,
  onClose,
  children,
  showDialogClose = true,
  className,
}: Props) {
  const arialTitle = (
    <VisuallyHidden.Root>
      <DialogTitle className=""> {title ?? "sample dialog"}</DialogTitle>
      <DialogDescription>{title ?? "sample dialog"}</DialogDescription>
    </VisuallyHidden.Root>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={tailwindCn(
          "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl",
          className
        )}
      >
        {children}
        {arialTitle}
        {showDialogClose && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-modal">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
}
