// Utility functions for consistent formatting across the app

export function formatCurrency(
  amount: number | string,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(num);
}

export function formatNumber(
  num: number | string,
  locale: string = "en-US"
): string {
  const number = typeof num === "string" ? parseFloat(num) : num;
  return new Intl.NumberFormat(locale).format(number);
}

export function formatPercent(
  value: number,
  decimals: number = 1,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatDate(
  date: string | Date,
  format: "short" | "long" | "numeric" = "short",
  locale: string = "en-US"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? { month: "short", day: "numeric", year: "numeric" }
      : format === "long"
        ? { weekday: "long", month: "long", day: "numeric", year: "numeric" }
        : { month: "numeric", day: "numeric", year: "numeric" };

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

export function formatTime(
  date: string | Date,
  locale: string = "en-US"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

export function formatDateTime(
  date: string | Date,
  locale: string = "en-US"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\\D/g, "");

  // Handle different lengths
  if (digits.length === 10) {
    // US format: (123) 456-7890
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11) {
    // +1 (123) 456-7890
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return as-is if we can't parse it
  return phoneNumber;
}

export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeWords(text: string): string {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}
