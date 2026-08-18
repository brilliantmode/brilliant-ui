import { describe, expect, it } from "vitest";
import {
  builtInThemes,
  createBrandTheme,
  createThemeInitScript,
  createThemeState,
  themeStateAttributes,
  themeToCssVariables,
  validateTheme,
} from "./index.js";

describe("themes", () => {
  it("ships valid built-in themes", () => {
    expect(builtInThemes.flatMap((theme) => validateTheme(theme))).toEqual([]);
  });

  it("resolves system theme preferences", () => {
    expect(createThemeState({ mode: "system", prefersDark: true }).resolvedMode).toBe("dark");
    expect(createThemeState({ mode: "light", prefersDark: true }).resolvedMode).toBe("light");
  });

  it("creates data attributes for document roots", () => {
    expect(
      themeStateAttributes(createThemeState({ density: "compact", contrast: "high" })),
    ).toEqual({
      "data-theme": "light",
      "data-theme-preference": "system",
      "data-density": "compact",
      "data-contrast": "high",
    });
  });

  it("validates tenant brand overrides and emits CSS variables", () => {
    const theme = createBrandTheme("acme", { primary: "oklch(0.5 0.2 120)" });
    expect(theme.colors.primary).toBe("oklch(0.5 0.2 120)");
    expect(themeToCssVariables(theme)).toContain("--brilliant-primary: oklch(0.5 0.2 120);");
  });

  it("returns an inline-safe initialization script", () => {
    const script = createThemeInitScript({ defaultMode: "dark" });
    expect(script).toContain("localStorage");
    expect(script).toContain("prefers-color-scheme");
    expect(script).toContain("data-theme");
  });
});
