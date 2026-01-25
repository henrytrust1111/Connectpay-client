"use client";

import { tailwindCn } from "@/helpers";
import { Button } from "../common-elements/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../common-elements/dropdown-menu";
import {
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  AArrowUp,
  AArrowDown,
} from "lucide-react";
import { SortDropdownProps } from "./types";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

// Re-exporting types for external use
export * from "./types";
export function SortDropdown({
  options,
  value = "",
  direction = "asc",
  onChange,
  className,
}: SortDropdownProps) {
  const isMobile = useIsMobile();
  const itemClass =
    "flex justify-between items-center rounded-lg text-body px-3 py-2";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={tailwindCn(
            "border-input items-center gap-2 border rounded-md h-9 box-border px-3 py-2 shadow-xs hover:bg-white text-muted-foreground",
            className
          )}
        >
          {direction === "desc" ? (
            <ArrowDownWideNarrow className="size-5" />
          ) : (
            <ArrowUpWideNarrow className="size-5" />
          )}

          <span className={tailwindCn("inline")}>
            {options.find((o) => o.key === value)?.label || "Sort"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isMobile ? "start" : "end"}
        className=" min-w-[186px] rounded-md p-1"
      >
        {options.map((option, index) => (
          <DropdownMenuGroup key={option.key}>
            <DropdownMenuItem
              className={tailwindCn(
                itemClass,
                value === option.key && direction === "asc"
                  ? "bg-muted/60 dark:bg-dark-background-200 font-medium"
                  : ""
              )}
              onClick={() => onChange(option.key, "asc")}
            >
              <span>{option.label}</span>
              <AArrowUp className="size-6" />
            </DropdownMenuItem>

            <DropdownMenuItem
              className={tailwindCn(
                itemClass,
                value === option.key && direction === "desc"
                  ? "bg-muted/60 dark:bg-dark-background-200  font-medium"
                  : ""
              )}
              onClick={() => onChange(option.key, "desc")}
            >
              <span>{option.label}</span>

              <AArrowDown className="size-6" />
            </DropdownMenuItem>
            {options.length - 1 !== index && (
              <DropdownMenuSeparator className="h-px bg-border/50 mx-1.5" />
            )}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
