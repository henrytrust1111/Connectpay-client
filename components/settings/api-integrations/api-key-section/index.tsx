"use client";
import { Copy, Info } from "lucide-react";
import React from "react";
import { copyToClipboard } from "../data";
import { Button } from "@/components/common-elements/button";

export const APIKeySection = ({ apiKey }: { apiKey?: string }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2 dark:text-dark-white">
          API Key Management
        </h2>
        <p className="text-sm text-muted-foreground dark:text-dark-text">
          Securely access your unique API key for integrating Eye by ProctorMe
          into your system.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-secondary-100 text-secondary-950 border border-secondary-200 rounded-md p-4 flex items-start gap-3">
        <Info className="size-5 shrink-0 mt-0.5" />
        <span className="text-sm">
          Your API key grants full access to your account&apos;s proctoring
          endpoints. Do not share it publicly.
        </span>
      </div>

      {/* API Key Display */}
      <div className="space-y-3 border border-[#E5E5E5] bg-[#fafafa] dark:bg-dark-background-100 dark:border-dark-border p-4 rounded-[8px]">
        <div>
          <h3 className="font-semibold mb-2">Your API Key</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Use this secure key to integrate Eye by ProctorMe into your system.
            Keep it confidential to prevent unauthorized access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-faint border rounded-md px-4 py-3 font-mono text-sm dark:text-dark-text dark:bg-dark-background-200">
            {apiKey}
          </div>
          <Button
            onClick={() => copyToClipboard(apiKey ?? "", "API key")}
            variant="dark"
            className="shrink-0 dark:bg-primary-600"
          >
            <Copy className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
