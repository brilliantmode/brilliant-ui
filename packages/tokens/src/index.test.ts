import { describe, expect, it } from "vitest";
import {
  motion,
  primitiveColors,
  semanticColors,
  semanticColorTokens,
  tokenArtifacts,
  tokens,
  typography,
} from "./index.js";

describe("design tokens", () => {
  it("uses OKLCH for every primitive brand color", () => {
    expect(Object.values(primitiveColors.brand).every((value) => value.startsWith("oklch("))).toBe(
      true,
    );
  });

  it("exposes motion and semantic foundations from one entry point", () => {
    expect(tokens.motion).toBe(motion);
    expect(tokens.radii.lg).toBe("0.625rem");
  });

  it("uses a native crisp UI font stack with a stable mono", () => {
    expect(typography.fontFamily.sans).toContain("-apple-system");
    expect(typography.fontFamily.sans).toContain("BlinkMacSystemFont");
    expect(typography.fontFamily.sans).toContain("Segoe UI");
    expect(typography.fontFamily.mono).toContain("IBM Plex Mono");
  });

  it("defines every semantic color in light and dark themes", () => {
    for (const token of semanticColorTokens) {
      expect(semanticColors.light[token]).toBeTruthy();
      expect(semanticColors.dark[token]).toBeTruthy();
    }
  });

  it("exports CSS, JSON, and Tailwind artifacts from the token source", () => {
    expect(tokenArtifacts.css).toContain("--brilliant-background");
    expect(tokenArtifacts.css).toContain("-webkit-font-smoothing: antialiased");
    expect(tokenArtifacts.css).toContain("font-synthesis-weight: none");
    expect(JSON.parse(tokenArtifacts.json)).toMatchObject({ typography });
    expect(tokenArtifacts.tailwindTheme.colors.primary).toBe("var(--brilliant-primary)");
  });
});
