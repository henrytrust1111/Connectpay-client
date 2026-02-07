// Global constants for consistent UI spacing and sizing

// Spacing scale (using Tailwind spacing)
export const SPACING = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  xxl: "3rem", // 48px
} as const;

// Border radius scale
export const BORDER_RADIUS = {
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
} as const;

// Typography scales
export const FONT_SIZES = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
} as const;

export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Z-index scale
export const Z_INDEX = {
  hide: -1,
  auto: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  tooltip: 40,
  modal_backdrop: 50,
  modal: 60,
  popover: 70,
  notification: 80,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Common shadows
export const SHADOWS = {
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
} as const;

// Transition timings
export const TRANSITIONS = {
  default: "all 0.3s ease",
  smooth: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  fast: "all 0.15s ease-out",
  slow: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
