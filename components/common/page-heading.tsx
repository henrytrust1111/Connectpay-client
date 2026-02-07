"use client";

import { tailwindCn } from "@/helpers";
import React from "react";

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: "h1" | "h2" | "h3";
  className?: string;
}

export function PageTitle({
  level = "h1",
  className,
  children,
  ...props
}: PageTitleProps) {
  const Component = level;
  const baseClasses =
    level === "h1"
      ? "text-4xl sm:text-5xl font-bold"
      : level === "h2"
        ? "text-3xl sm:text-4xl font-bold"
        : "text-2xl sm:text-3xl font-bold";

  return (
    <Component
      className={tailwindCn("text-foreground", baseClasses, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

interface PageDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export function PageDescription({
  className,
  children,
  ...props
}: PageDescriptionProps) {
  return (
    <p
      className={tailwindCn("text-lg text-muted-foreground mt-2", className)}
      {...props}
    >
      {children}
    </p>
  );
}

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={tailwindCn("space-y-2", className)} {...props}>
      <PageTitle>{title}</PageTitle>
      {description && <PageDescription>{description}</PageDescription>}
    </div>
  );
}
