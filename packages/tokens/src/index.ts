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
    50: "oklch(0.97 0.018 276)",
    100: "oklch(0.94 0.038 276)",
    200: "oklch(0.89 0.074 276)",
    300: "oklch(0.8 0.128 276)",
    400: "oklch(0.69 0.18 276)",
    500: "oklch(0.61 0.22 276)",
    600: "oklch(0.54 0.23 276)",
    700: "oklch(0.48 0.22 276)",
    800: "oklch(0.4 0.18 276)",
    900: "oklch(0.34 0.13 276)",
    950: "oklch(0.24 0.09 276)",
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
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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

export const semanticColorTokens = [
  "background",
  "foreground",
  "surface",
  "surface-raised",
  "muted",
  "muted-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "critical",
  "critical-foreground",
  "border",
  "ring",
] as const;

export type SemanticColorToken = (typeof semanticColorTokens)[number];

export type SemanticColorScale = Readonly<Record<SemanticColorToken, string>>;

export const semanticColors = {
  light: {
    background: primitiveColors.neutral[50],
    foreground: primitiveColors.neutral[900],
    surface: primitiveColors.neutral[0],
    "surface-raised": primitiveColors.neutral[0],
    muted: primitiveColors.neutral[100],
    "muted-foreground": primitiveColors.neutral[600],
    primary: primitiveColors.brand[600],
    "primary-foreground": primitiveColors.neutral[0],
    secondary: primitiveColors.neutral[200],
    "secondary-foreground": primitiveColors.neutral[800],
    critical: "oklch(0.577 0.245 27.325)",
    "critical-foreground": "oklch(0.985 0 0)",
    border: primitiveColors.neutral[300],
    ring: primitiveColors.brand[500],
  },
  dark: {
    background: primitiveColors.neutral[950],
    foreground: primitiveColors.neutral[100],
    surface: "oklch(0.18 0.03 263)",
    "surface-raised": primitiveColors.neutral[900],
    muted: primitiveColors.neutral[800],
    "muted-foreground": primitiveColors.neutral[400],
    primary: primitiveColors.brand[400],
    "primary-foreground": primitiveColors.neutral[950],
    secondary: primitiveColors.neutral[800],
    "secondary-foreground": primitiveColors.neutral[100],
    critical: "oklch(0.704 0.191 22.216)",
    "critical-foreground": primitiveColors.neutral[950],
    border: "oklch(1 0 0 / 0.12)",
    ring: primitiveColors.brand[400],
  },
  highContrast: {
    background: primitiveColors.neutral[0],
    foreground: primitiveColors.neutral[1000],
    surface: primitiveColors.neutral[0],
    "surface-raised": primitiveColors.neutral[0],
    muted: primitiveColors.neutral[100],
    "muted-foreground": primitiveColors.neutral[900],
    primary: "oklch(0.35 0.22 262)",
    "primary-foreground": primitiveColors.neutral[0],
    secondary: primitiveColors.neutral[100],
    "secondary-foreground": primitiveColors.neutral[1000],
    critical: "oklch(0.42 0.22 27)",
    "critical-foreground": primitiveColors.neutral[0],
    border: primitiveColors.neutral[1000],
    ring: primitiveColors.neutral[1000],
  },
} as const satisfies Record<"light" | "dark" | "highContrast", SemanticColorScale>;

export const density = {
  comfortable: {
    controlHeight: "2.5rem",
    controlPaddingX: spacing[4],
    controlGap: spacing[2],
  },
  compact: {
    controlHeight: "2rem",
    controlPaddingX: spacing[3],
    controlGap: spacing[1.5],
  },
  touch: {
    controlHeight: "2.75rem",
    controlPaddingX: spacing[5],
    controlGap: spacing[3],
  },
} as const;

export const tokens = {
  borderWidth,
  breakpoints,
  density,
  elevation,
  motion,
  opacity,
  primitiveColors,
  radii,
  semanticColors,
  spacing,
  typography,
  zIndex,
} as const;

export type BrilliantTokens = typeof tokens;

function cssVariables(values: Readonly<Record<string, string | number>>, prefix: string): string {
  return Object.entries(values)
    .map(([name, value]) => `  --${prefix}-${name}: ${value};`)
    .join("\n");
}

function semanticColorVariables(scale: SemanticColorScale): string {
  return semanticColorTokens.map((token) => `  --brilliant-${token}: ${scale[token]};`).join("\n");
}

export const tokenArtifacts = {
  css: [
    ":root {",
    semanticColorVariables(semanticColors.light),
    `  --brilliant-radius: ${radii.lg};`,
    `  --brilliant-font-sans: ${typography.fontFamily.sans};`,
    `  --brilliant-font-mono: ${typography.fontFamily.mono};`,
    `  --brilliant-shadow-sm: ${elevation[1]};`,
    `  --brilliant-shadow-md: ${elevation[2]};`,
    cssVariables(motion.duration, "brilliant-duration"),
    `  --brilliant-ease-standard: ${motion.easing.standard};`,
    `  --brilliant-ease-enter: ${motion.easing.enter};`,
    `  --brilliant-ease-exit: ${motion.easing.exit};`,
    `  --brilliant-ease-spring: ${motion.easing.spring};`,
    `  --brilliant-control-height: ${density.comfortable.controlHeight};`,
    `  --brilliant-control-padding-x: ${density.comfortable.controlPaddingX};`,
    `  --brilliant-control-gap: ${density.comfortable.controlGap};`,
    "}",
    "",
    '.dark, [data-theme="dark"] {',
    semanticColorVariables(semanticColors.dark),
    `  --brilliant-shadow-sm: ${elevation[1].replace("0.06", "0.24")};`,
    `  --brilliant-shadow-md: ${elevation[2].replace("4px 12px", "6px 18px").replace("0.08", "0.32")};`,
    "}",
    "",
    '[data-contrast="high"] {',
    semanticColorVariables(semanticColors.highContrast),
    "}",
  ].join("\n"),
  json: JSON.stringify(tokens, null, 2),
  tailwindTheme: {
    colors: Object.fromEntries(
      semanticColorTokens.map((token) => [token, `var(--brilliant-${token})`]),
    ) as Record<SemanticColorToken, string>,
    fontFamily: {
      sans: "var(--brilliant-font-sans)",
      mono: "var(--brilliant-font-mono)",
    },
    radius: {
      sm: "calc(var(--brilliant-radius) - 0.25rem)",
      md: "calc(var(--brilliant-radius) - 0.125rem)",
      lg: "var(--brilliant-radius)",
      xl: "calc(var(--brilliant-radius) + 0.125rem)",
    },
    shadow: {
      sm: "var(--brilliant-shadow-sm)",
      md: "var(--brilliant-shadow-md)",
    },
  },
} as const;
