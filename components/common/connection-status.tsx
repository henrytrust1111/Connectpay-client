"use client";

import { Wifi, WifiOff } from "lucide-react";
import { tailwindCn } from "@/helpers";

interface ConnectionStatusProps {
  isConnected: boolean;
  variant?: "badge" | "inline";
  className?: string;
}

export function ConnectionStatus({
  isConnected,
  variant = "inline",
  className,
}: ConnectionStatusProps) {
  if (variant === "badge") {
    return (
      <div
        className={tailwindCn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          isConnected
            ? "bg-success-light text-success dark:bg-success/20"
            : "bg-error-light text-error dark:bg-error/20",
          className
        )}
      >
        {isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        <span>{isConnected ? "Connected" : "Disconnected"}</span>
      </div>
    );
  }

  return (
    <div
      className={tailwindCn(
        "flex items-center gap-2 text-sm",
        isConnected ? "text-success" : "text-error",
        className
      )}
    >
      {isConnected ? (
        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
      ) : (
        <div className="h-2 w-2 rounded-full bg-error" />
      )}
      <span>{isConnected ? "Online" : "Offline"}</span>
    </div>
  );
}
