"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { tailwindCn } from "@/helpers";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center justify-center w-10 h-10 rounded-md outline-0 border border-gray-200 hover:bg-gray-50 transition cursor-pointer bg-white dark:bg-dark-background-100 dark:border-dark-background-50"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
      </button>

      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={item.path} className="flex items-center">
              <Link
                href={item.path}
                prefetch={false}
                className={tailwindCn(
                  isLast
                    ? "text-primary font-medium hover:text-primary-700 dark:text-[#A7B6FA]"
                    : " hover:underline"
                )}
              >
                {item.name}
              </Link>

              {!isLast && <span className="mx-2 text-gray-500">/</span>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
