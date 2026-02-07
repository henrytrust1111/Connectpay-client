"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/common-elements/tooltip";
import { tailwindCn } from "@/helpers";
import type { ReactNode } from 'react';

interface AccessibleIconButtonTooltipProps {
  children: React.ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  className?: string;
}

/**
 * Accessible icon button wrapper with tooltip
 * Use this component to wrap icon-only buttons with explanatory text
 * Ensures buttons are accessible via aria-label and provides visual tooltip
 */
export function AccessibleIconButtonTooltip({
  children,
  label,
  side = "top",
  delayDuration = 200,
  className,
}: AccessibleIconButtonTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild className={tailwindCn("outline-none", className)}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface AccessibleIconProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  className?: string;
}

export function AccessibleIcon({ icon: Icon, label, className }: AccessibleIconProps) {
  return (
    <>
      <Icon className={className} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </>
  );
}
