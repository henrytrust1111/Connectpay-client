"use client";

import { Button } from "@/components/common-elements/button";
import { menu } from "@/constants";
import { tailwindCn } from "@/helpers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const MobileNavbar = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed z-20 w-full bg-white dark:bg-dark-background-100 -bottom-[2px] border-t border-gray-200 dark:border-dark-border md:hidden">
      <ul className="h-[77px] flex justify-around gap-2 items-center list-none p-2">
        {menu.map((item) => {
          const isActive = pathname?.includes(item.link);
          return (
            <Button
              key={item.link}
              asChild
              variant="ghost"
              data-active={isActive}
              className={tailwindCn(
                "![padding-inline:0] text-secondary flex-1 flex flex-col font-semibold h-full text-[0.625rem] text-center",
                {
                  "data-[active=true]:bg-primary-900 dark:data-[active=true]:bg-primary-600 data-[active=true]:text-white overflow-hidden px-0.5":
                    isActive,
                }
              )}
            >
              <Link href={item.link}>
                <item.icon className=" [&_*]:stroke-[2] " />
                <span
                  className={tailwindCn({
                    "line-clamp-1 truncate block w-11/12": isActive,
                  })}
                >
                  {item.name}
                </span>
              </Link>
            </Button>
          );
        })}
      </ul>
    </nav>
  );
};
