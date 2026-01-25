"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { getTitleAndDetails } from "./data";
import { ThemeSwitcher, TMode } from "@/components/theme-switcher";
import { LogOut, Menu, X } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common-elements/avatar";
import { Button } from "@/components/common-elements/button";
import { useSession } from "@/hooks";
import { getAvatarInitials, tailwindCn } from "@/helpers";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
const LogoImage = dynamic(
  () =>
    import("@/components/auth/auth-logo/logo-image").then(
      (mod) => mod.LogoImage
    ),
  {
    ssr: false,
  }
);

export const MainHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { logout, session } = useSession();

  return (
    <header
      className={tailwindCn(
        " border-b border-b-neutral-200 dark:border-b-dark-border fixed md:sticky top-0 left-0 right-0 z-20 bg-white dark:bg-dark-background-100 transition-[box-shadow,border-radius] duration-300 ease-in-out",
        {
          "shadow-[-12px_12px_16px_-6px_rgba(0,0,0,0.08),_inset_0px_-2px_0px_rgba(0,0,0,0.08)] md:shadow-none rounded-xl md:rounded-none":
            isOpen,
        }
      )}
    >
      <div className="flex justify-between px-4 py-2 md:px-7.5 md:py-3.5 h-14 md:h-24">
        <div className="flex items-center">
          <div className="relative h-10 w-[104.48px] md:h-[39.31px] md:hidden">
            <LogoImage theme={theme} className="my-auto h-full w-auto" />
          </div>
          <div className=" hidden md:block">
            <h1 className="text-xl font-bold dark:text-white">
              {getTitleAndDetails(pathname).title}
            </h1>
            <p className=" text-neutral-500 dark:text-[#DFE2F0] max-w-[453px] text-xs">
              {getTitleAndDetails(pathname).details}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="relative"
            >
              <Menu
                className={`absolute h-6 w-6 transition-all duration-300 ${
                  isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                className={`absolute h-6 w-6 transition-all duration-300 ${
                  isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              />
            </Button>
          </div>
          <div className=" hidden md:block">
            <ThemeSwitcher
              mode={theme as TMode}
              handleChange={(mode) => setTheme(mode)}
            />
          </div>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className=" px-4.5 pb-4.5">
          <div className="border-t border-border space-y-4">
            <div className=" flex items-center justify-center space-x-3 text-secondary w-full pt-4">
              <Avatar className="h-12 w-12 ">
                <AvatarImage src={session?.user?.imageUrl || undefined} />
                <AvatarFallback className=" bg-primary-700 dark:bg-primary-400 text-white">
                  {getAvatarInitials(session?.user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <p className=" line-clamp-1 truncate">
                {session?.user?.name || "no name"}
              </p>
            </div>
            <div>
              <ThemeSwitcher
                mode={theme as TMode}
                handleChange={(mode) => setTheme(mode)}
                view="button"
              />
            </div>
            <div>
              <Button
                variant="outline"
                size="default"
                className="w-full border-body text-body h-16"
                onClick={logout}
              >
                <LogOut className="!h-6 !w-6 [&_*]:stroke-[2]" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
