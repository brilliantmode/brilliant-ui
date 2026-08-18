export const primitiveColors = {
  neutral: {
    0: "oklch(1 0 0)",
    50: "oklch(0.985 0.002 247.839)",
    100: "oklch(0.967 0.003 264.542)",
    200: "oklch(0.928 0.006 264.531)",
    300: "oklch(0.872 0.01 258.338)",
    400: "oklch(0.707 0.022 261.325)",
    500: "oklch(0.551 0.027 264.364)",
    600: "oklch(0.446 0.03 256.802)",
    700: "oklch(0.373 0.034 259.733)",
    800: "oklch(0.278 0.033 256.848)",
    900: "oklch(0.21 0.034 264.665)",
    950: "oklch(0.13 0.028 261.692)",
    1000: "oklch(0 0 0)",
  },
  brand: {
    50: "oklch(0.97 0.014 254.604)",
    100: "oklch(0.932 0.032 255.585)",
    200: "oklch(0.882 0.059 254.128)",
    300: "oklch(0.809 0.105 251.813)",
    400: "oklch(0.707 0.165 254.624)",
    500: "oklch(0.623 0.214 259.815)",
    600: "oklch(0.546 0.245 262.881)",
    700: "oklch(0.488 0.243 264.376)",
    800: "oklch(0.424 0.199 265.638)",
    900: "oklch(0.379 0.146 265.522)",
    950: "oklch(0.282 0.091 267.935)",
  },
  green: "oklch(0.627 0.194 149.214)",
  amber: "oklch(0.769 0.188 70.08)",
  red: "oklch(0.637 0.237 25.331)",
} as const;

export const radii = {
  none: "0",
  xs: "0.25rem",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.625rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const typography = {
  fontFamily: {
    sans: '"Instrument Sans Variable", "Instrument Sans", ui-sans-serif, system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
  },
  fontSize: {
    xs: ["0.75rem", "1rem"],
    sm: ["0.875rem", "1.25rem"],
    base: ["1rem", "1.5rem"],
    lg: ["1.125rem", "1.75rem"],
    xl: ["1.25rem", "1.75rem"],
    "2xl": ["1.5rem", "2rem"],
    "3xl": ["1.875rem", "2.25rem"],
  },
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

export const motion = {
  duration: { instant: "0ms", fast: "120ms", normal: "200ms", slow: "320ms" },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    enter: "cubic-bezier(0, 0, 0, 1)",
    exit: "cubic-bezier(0.3, 0, 1, 1)",
    spring:
      "linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077 20.9%, 1.121 22.9%, 1.137, 1.144 25.1%, 1.143 27.1%, 1.126 30.7%, 1.051 40.8%, 1.017 46.4%, 0.997 53.4%, 0.991 61.1%, 1)",
  },
} as const;

export const elevation = {
  0: "none",
  1: "0 1px 2px oklch(0 0 0 / 0.06)",
  2: "0 4px 12px oklch(0 0 0 / 0.08)",
  3: "0 12px 32px oklch(0 0 0 / 0.12)",
} as const;

export const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  toast: 1400,
  tooltip: 1500,
} as const;

export const opacity = {
  disabled: 0.5,
  muted: 0.7,
  overlay: 0.72,
} as const;

export const borderWidth = { 0: "0", 1: "1px", 2: "2px" } as const;

export const tokens = {
  borderWidth,
  breakpoints,
  elevation,
  motion,
  opacity,
  primitiveColors,
  radii,
  spacing,
  typography,
  zIndex,
} as const;

export type BrilliantTokens = typeof tokens;
