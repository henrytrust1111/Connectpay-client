"use client";

import { Progress } from "@/components/common-elements/progress";
import { tailwindCn } from "@/helpers";

interface PasswordStrengthIndicatorProps {
  password: string;
}

function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (!password) {
    return { score: 0, label: "", color: "" };
  }

  // Length check
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;

  // Character variety
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  if (score < 40) {
    return { score, label: "Weak", color: "bg-error" };
  } else if (score < 70) {
    return { score, label: "Medium", color: "bg-warning" };
  } else {
    return { score, label: "Strong", color: "bg-success" };
  }
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { score, label, color } = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="relative">
        <Progress value={score} className="h-2" />
        <div
          className={tailwindCn(
            "absolute top-0 left-0 h-2 rounded-full transition-all",
            color
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
}
