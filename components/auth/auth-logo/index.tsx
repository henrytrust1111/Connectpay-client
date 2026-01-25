"use client";

import { tailwindCn } from "@/helpers";
import { useTheme } from "next-themes";
import Link from "next/link";
import dynamic from "next/dynamic";
const LogoImage = dynamic(
  () => import("./logo-image").then((mod) => mod.LogoImage),
  {
    ssr: false,
  }
);

export default function AuthLogo({ className }: { className?: string }) {
  const { theme } = useTheme();
  return (
    <div className={tailwindCn("flex lg:mb-4", className)}>
      <Link href="/" className="relative w-[100px] h-[39px] block">
        <LogoImage theme={theme} />
      </Link>
    </div>
  );
}
