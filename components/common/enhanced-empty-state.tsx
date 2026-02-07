import { LucideIcon } from "lucide-react";
import { Button } from "@/components/common-elements/button";
import { tailwindCn } from "@/helpers";

interface EnhancedEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  };
  className?: string;
}

export function EnhancedEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EnhancedEmptyStateProps) {
  return (
    <div
      className={tailwindCn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button variant={action.variant || "default"} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
