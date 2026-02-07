"use client";

import { AlertCircle } from "lucide-react";
import { tailwindCn } from "@/helpers";

interface FormErrorProps {
  error?: string | null;
  className?: string;
  role?: string;
}

export function FormError({ error, className, role = "alert" }: FormErrorProps) {
  if (!error) return null;

  return (
    <div
      className={tailwindCn(
        "flex items-start gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20",
        className
      )}
      role={role}
      aria-live="polite"
    >
      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm text-destructive">{error}</p>
    </div>
  );
}

interface FormSuccessProps {
  message?: string | null;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div
      className={tailwindCn(
        "flex items-start gap-3 p-3 rounded-md bg-success/10 border border-success/20",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="h-4 w-4 rounded-full bg-success shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm text-success">{message}</p>
    </div>
  );
}
