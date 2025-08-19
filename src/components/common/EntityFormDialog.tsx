// components/common/EntityFormDialog.tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EntityFormDialogProps {
  title: string;
  description: string;
  triggerLabel: ReactNode;
  children: ReactNode;
}

export function EntityFormDialog({
  title,
  description,
  triggerLabel,
  children,
}: EntityFormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
