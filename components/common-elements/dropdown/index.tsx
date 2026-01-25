"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common-elements/select";
import { tailwindCn } from "@/helpers";

export interface DropdownOption {
  value: string;
  label: string;
  badge?: {
    text: string;
    className?: string;
  };
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  showBadgeInTrigger?: boolean;
}

export function Dropdown({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
  triggerClassName,
  disabled = false,
  showBadgeInTrigger = false,
}: DropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={tailwindCn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder}>
          {selectedOption && (
            <div className="flex items-center gap-2">
              {showBadgeInTrigger && selectedOption.badge && (
                <span className={tailwindCn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  selectedOption.badge.className
                )}>
                  {selectedOption.badge.text}
                </span>
              )}
              <span>{selectedOption.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className={className}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              {option.badge && (
                <span className={tailwindCn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  option.badge.className
                )}>
                  {option.badge.text}
                </span>
              )}
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}