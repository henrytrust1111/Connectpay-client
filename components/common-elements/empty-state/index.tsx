import { tailwindCn } from "@/helpers";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={tailwindCn(
      "flex flex-col items-center justify-center py-16 text-center",
      className
    )}>
      {icon && (
        <div className="w-12 h-12 mb-px rounded-lg text-neutral-900 dark:text-dark-text flex items-center justify-center">
          {icon}
        </div>
      )}
      <p className="text-neutral-900 dark:text-dark-text font-semibold">{title}</p>
      {description && (
        <p className="text-neutral-900 font-semibold dark:text-dark-text">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}