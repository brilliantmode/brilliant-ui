import {
  density,
  type SemanticColorScale,
  type SemanticColorToken,
  semanticColors,
  semanticColorTokens,
} from "@brilliant-ui/tokens";

export const themeModes = ["light", "dark", "system"] as const;
export const themeDensities = ["comfortable", "compact", "touch"] as const;
export const themeContrasts = ["normal", "high"] as const;

export type ThemeMode = (typeof themeModes)[number];
export type ThemeDensity = (typeof themeDensities)[number];
export type ThemeContrast = (typeof themeContrasts)[number];

export interface BrilliantTheme {
  readonly name: string;
  readonly label: string;
  readonly mode: Exclude<ThemeMode, "system">;
  readonly colors: SemanticColorScale;
  readonly density: ThemeDensity;
  readonly contrast: ThemeContrast;
}

export interface ThemeState {
  readonly mode: ThemeMode;
  readonly resolvedMode: Exclude<ThemeMode, "system">;
  readonly density: ThemeDensity;
  readonly contrast: ThemeContrast;
}

export interface ThemeScriptOptions {
  readonly defaultMode?: ThemeMode;
  readonly defaultDensity?: ThemeDensity;
  readonly defaultContrast?: ThemeContrast;
  readonly storageKey?: string;
  readonly densityStorageKey?: string;
  readonly contrastStorageKey?: string;
}

export const themeStorageKeys = {
  mode: "brilliant-ui-theme",
  density: "brilliant-ui-density",
  contrast: "brilliant-ui-contrast",
} as const;

export const defaultThemeState = {
  mode: "system",
  resolvedMode: "light",
  density: "comfortable",
  contrast: "normal",
} as const satisfies ThemeState;

export const builtInThemes = [
  {
    name: "light",
    label: "Light",
    mode: "light",
    colors: semanticColors.light,
    density: "comfortable",
    contrast: "normal",
  },
  {
    name: "dark",
    label: "Dark",
    mode: "dark",
    colors: semanticColors.dark,
    density: "comfortable",
    contrast: "normal",
  },
  {
    name: "high-contrast",
    label: "High contrast",
    mode: "light",
    colors: semanticColors.highContrast,
    density: "comfortable",
    contrast: "high",
  },
] as const satisfies readonly BrilliantTheme[];

function includes<const Values extends readonly string[]>(
  values: Values,
  value: string,
): value is Values[number] {
  return values.includes(value);
}

export function isThemeMode(value: string): value is ThemeMode {
  return includes(themeModes, value);
}

export function isThemeDensity(value: string): value is ThemeDensity {
  return includes(themeDensities, value);
}

export function isThemeContrast(value: string): value is ThemeContrast {
  return includes(themeContrasts, value);
}

export function resolveThemeMode(
  mode: ThemeMode,
  prefersDark: boolean,
): Exclude<ThemeMode, "system"> {
  if (mode === "system") return prefersDark ? "dark" : "light";
  return mode;
}

export function createThemeState(
  input: Partial<Omit<ThemeState, "resolvedMode">> & { readonly prefersDark?: boolean } = {},
): ThemeState {
  const mode = input.mode ?? defaultThemeState.mode;
  const densityName = input.density ?? defaultThemeState.density;
  const contrast = input.contrast ?? defaultThemeState.contrast;
  return {
    mode,
    resolvedMode: resolveThemeMode(mode, input.prefersDark ?? false),
    density: densityName,
    contrast,
  };
}

export function validateTheme(theme: BrilliantTheme): readonly string[] {
  const errors: string[] = [];
  for (const token of semanticColorTokens) {
    if (!theme.colors[token]) errors.push(`Missing semantic color "${token}".`);
  }
  if (!isThemeDensity(theme.density)) errors.push(`Unknown density "${theme.density}".`);
  if (!isThemeContrast(theme.contrast)) errors.push(`Unknown contrast "${theme.contrast}".`);
  return errors;
}

export function createBrandTheme(
  name: string,
  overrides: Partial<Record<SemanticColorToken, string>>,
  options: Partial<Pick<BrilliantTheme, "label" | "mode" | "density" | "contrast">> = {},
): BrilliantTheme {
  const mode = options.mode ?? "light";
  const theme = {
    name,
    label: options.label ?? name,
    mode,
    colors: { ...semanticColors[mode], ...overrides },
    density: options.density ?? "comfortable",
    contrast: options.contrast ?? "normal",
  } as const satisfies BrilliantTheme;
  const errors = validateTheme(theme);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return theme;
}

export function themeStateAttributes(state: ThemeState): Record<string, string> {
  return {
    "data-theme": state.resolvedMode,
    "data-theme-preference": state.mode,
    "data-density": state.density,
    "data-contrast": state.contrast,
  };
}

export function themeToCssVariables(theme: BrilliantTheme): string {
  const colorVariables = semanticColorTokens
    .map((token) => `  --brilliant-${token}: ${theme.colors[token]};`)
    .join("\n");
  const densityValues = density[theme.density];
  return [
    `[data-brilliant-theme="${theme.name}"] {`,
    colorVariables,
    `  --brilliant-control-height: ${densityValues.controlHeight};`,
    `  --brilliant-control-padding-x: ${densityValues.controlPaddingX};`,
    `  --brilliant-control-gap: ${densityValues.controlGap};`,
    "}",
  ].join("\n");
}

export function createThemeInitScript(options: ThemeScriptOptions = {}): string {
  const modeKey = JSON.stringify(options.storageKey ?? themeStorageKeys.mode);
  const densityKey = JSON.stringify(options.densityStorageKey ?? themeStorageKeys.density);
  const contrastKey = JSON.stringify(options.contrastStorageKey ?? themeStorageKeys.contrast);
  const defaultMode = JSON.stringify(options.defaultMode ?? defaultThemeState.mode);
  const defaultDensity = JSON.stringify(options.defaultDensity ?? defaultThemeState.density);
  const defaultContrast = JSON.stringify(options.defaultContrast ?? defaultThemeState.contrast);

  return `(function(){try{var d=document.documentElement;var m=localStorage.getItem(${modeKey})||${defaultMode};var den=localStorage.getItem(${densityKey})||${defaultDensity};var con=localStorage.getItem(${contrastKey})||${defaultContrast};var dark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;var resolved=m==="system"?(dark?"dark":"light"):m;d.setAttribute("data-theme",resolved);d.setAttribute("data-theme-preference",m);d.setAttribute("data-density",den);d.setAttribute("data-contrast",con);d.style.colorScheme=resolved;}catch(e){}})();`;
}
