import { describe, expect, it, vi } from "vitest";
import { animationPresets, prefersReducedMotion, reducedMotionPreset } from "./index.js";

describe("animation presets", () => {
  it("defines enter, exit, disclosure, and feedback presets", () => {
    expect(Object.keys(animationPresets)).toEqual(["enter", "exit", "disclosure", "feedback"]);
  });

  it("collapses motion duration for reduced-motion fallbacks", () => {
    expect(reducedMotionPreset("enter").transition.duration).toBe(0);
  });

  it("detects reduced-motion media preference when available", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    expect(prefersReducedMotion()).toBe(true);
    vi.unstubAllGlobals();
  });
});
