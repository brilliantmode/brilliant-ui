import type { LucideProps } from "lucide-react";

export type { LucideIcon, LucideProps } from "lucide-react";
export { Check, ChevronDown, LoaderCircle, Search, X } from "lucide-react";

export const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

export type IconSize = keyof typeof iconSizes;

export const iconStrokes = {
  regular: 2,
  strong: 2.25,
} as const;

export interface IconOptions {
  readonly size?: IconSize;
  readonly decorative?: boolean;
  readonly label?: string;
}

export function iconProps(
  options: IconOptions = {},
): Pick<LucideProps, "aria-hidden" | "aria-label" | "focusable" | "size" | "strokeWidth"> {
  const decorative = options.decorative ?? !options.label;
  return {
    "aria-hidden": decorative ? true : undefined,
    "aria-label": decorative ? undefined : options.label,
    focusable: false,
    size: iconSizes[options.size ?? "md"],
    strokeWidth: iconStrokes.regular,
  };
}
