import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function tailwindCn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
