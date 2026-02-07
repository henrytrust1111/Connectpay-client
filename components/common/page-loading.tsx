"use client";

import { Loader2 } from "lucide-react";
import { tailwindCn } from "@/helpers";

interface PageLoadingProps {
  title?: string;
  description?: string;
  fullScreen?: boolean;
  className?: string;
}

export function PageLoading({
  title = "Loading",
  description = "Please wait while we load your content...",
  fullScreen = false,
  className,
}: PageLoadingProps) {
  return (
    <div
      className={tailwindCn(
        "flex flex-col items-center justify-center",
        fullScreen ? "min-h-screen" : "min-h-[400px]",
        className
      )}
      role="status"
      aria-label="Page is loading"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

interface InlineLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function InlineLoading({
  message = "Loading...",
  size = "md",
  className,
}: InlineLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={tailwindCn("flex items-center gap-2", className)}
      role="status"
      aria-label="Loading"
    >
      <Loader2
        className={tailwindCn("animate-spin text-primary", sizeClasses[size])}
        aria-hidden="true"
      />
      <span className="text-sm">{message}</span>
    </div>
  );
}
