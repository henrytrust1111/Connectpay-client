"use client";
import React from "react";
import { Button } from "../common-elements/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
  showBack?: boolean;
}
export const MobileTitle = ({ title, showBack }: Props) => {
  const router = useRouter();
  const goBack = () => router.back();
  return (
    <div className="md:hidden p-4 border-b flex items-center gap-3 border-b-neutral-200 dark:border-b-dark-border">
      {showBack && (
        <Button
          onClick={goBack}
          className="p-2 size-10 dark:bg-dark-background-100"
          variant={"outline"}
        >
          <ChevronLeft />
        </Button>
      )}
      <h2 className=" text-xl font-bold w-full truncate line-clamp-1">
        {title}
      </h2>
    </div>
  );
};
