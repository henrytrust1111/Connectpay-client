"use client";

import { useSocket } from "@/hooks/useSocket";
import { tailwindCn } from "@/helpers";
import { Dot } from "lucide-react";

interface ConnectionStatusBadgeProps {
  variant?: "dot" | "pill";
  className?: string;
}

export function ConnectionStatusBadge({
  variant = "dot",
  className,
}: ConnectionStatusBadgeProps) {
  const { isConnected } = useSocket();

  if (variant === "dot") {
    return (
      <div
        className={tailwindCn(
          "flex items-center gap-1.5",
          className
        )}
        aria-label={`Connection status: ${isConnected ? "Connected" : "Disconnected"}`}
      >
        <Dot
          className={tailwindCn(
            "h-4 w-4 animate-pulse",
            isConnected ? "text-green-500" : "text-red-500"
          )}
          fill={isConnected ? "currentColor" : "none"}
        />
      </div>
    );
  }

  return (
    <div
      className={tailwindCn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
        isConnected
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        className
      )}
      role="status"
      aria-label={`Connection status: ${isConnected ? "Connected" : "Disconnected"}`}
    >
      <Dot
        className={tailwindCn(
          "h-3 w-3",
          isConnected ? "text-green-500" : "text-red-500"
        )}
        fill={isConnected ? "currentColor" : "none"}
      />
      {isConnected ? "Connected" : "Disconnected"}
    </div>
  );
}
