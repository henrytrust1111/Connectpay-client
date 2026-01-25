export type SortDirection = "asc" | "desc";
export interface SortOption {
  label: string;
  key: string;
}

export interface SortDropdownProps {
  options: SortOption[];
  value?: string; // current selected key
  direction: SortDirection;
  onChange: (key: string, direction: SortDirection) => void;
  className?: string;
}
