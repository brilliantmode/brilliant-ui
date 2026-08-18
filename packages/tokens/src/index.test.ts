import { describe, expect, it } from "vitest";
import { motion, primitiveColors, tokens } from "./index.js";

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
});
