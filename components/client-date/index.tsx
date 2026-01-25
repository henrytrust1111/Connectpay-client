import React from "react";
import dayjs from "dayjs";

type ClientDateProps = {
  date: string | Date;
  format?: string; // custom formatting e.g. "HH:mm:ss"
  type?: "date" | "time" | "datetime"; // quick presets
  fallback?: string; // what to show if date is invalid
};

export function ClientDate({
  date,
  format,
  type = "date",
  fallback = "---",
}: ClientDateProps) {
  const d = dayjs(date);

  if (!d.isValid()) return <>{fallback}</>;

  // If user provides a custom format, use it
  if (format) return <>{d.format(format)}</>;

  // Built-in quick formats
  switch (type) {
    case "date":
      return <>{d.format("MMM D, YYYY")}</>;
    case "time":
      return <>{d.format("h:mm A")}</>;
    case "datetime":
      return <>{d.format("MMM D, YYYY h:mm A")}</>;
    default:
      return <>{d.format("MMM D, YYYY")}</>;
  }
}
