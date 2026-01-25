"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../common-elements/select";
import { TMode } from "./types";
import { getModeLabel, modeOptions } from "./data";
import { SunIcon, SunMoonIcon } from "lucide-react";
import { tailwindCn } from "@/helpers";
import { Button } from "../common-elements/button";

// ThemeSwitcher types export
export * from "./types";

interface Props {
  mode: TMode;
  handleChange?: (mode: TMode) => void;
  view?: "dropdown" | "button";
}

export const ThemeSwitcher = React.memo(
  ({ mode, handleChange, view = "dropdown" }: Props) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    const modeItem = (mode: TMode, isValue?: boolean) => (
      <span
        className={tailwindCn("inline-flex items-center gap-1 text-sm h-10", {
          "text-black dark:text-white": isValue,
        })}
      >
        {mode === "dark" ? (
          <SunMoonIcon className="!w-6 !h-6" />
        ) : (
          <SunIcon className="!w-6 !h-6" />
        )}
        {getModeLabel(mode)}
      </span>
    );

    if (!isMounted) {
      return null;
    }

    return (
      <>
        {view === "dropdown" && (
          <Select onValueChange={handleChange} value={mode}>
            <SelectTrigger className="w-[168px] data-[size=default]:h-12">
              {modeItem(mode, true)}
            </SelectTrigger>
            <SelectContent className="z-200! w-[168px]">
              {modeOptions.map(({ value }) => (
                <SelectItem
                  key={value}
                  value={value}
                  className=" inline-flex items-center gap-1 text-body"
                >
                  {modeItem(value as TMode)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {view === "button" && (
          <div className="flex flex-col space-y-3">
            {modeOptions.map(({ value }) => (
              <Button
                key={value}
                variant="ghost"
                onClick={() => handleChange && handleChange(value as TMode)}
                className={tailwindCn("h-10 text-body", {
                  "bg-accent": mode === value,
                })}
              >
                {modeItem(value as TMode)}
              </Button>
            ))}
          </div>
        )}
      </>
    );
  }
);

ThemeSwitcher.displayName = "ThemeSwitcher";
