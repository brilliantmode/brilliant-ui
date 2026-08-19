import { describe, expect, it, vi } from "vitest";
import {
  animationPresets,
  microDurations,
  microEasings,
  microUx,
  microUxClasses,
  prefersReducedMotion,
  reducedMotionPreset,
} from "./index.js";

describe("animation presets", () => {
  it("defines enter, exit, disclosure, and feedback presets", () => {
    expect(Object.keys(animationPresets)).toEqual([
      "enter",
      "exit",
      "disclosure",
      "feedback",
      "press",
      "lift",
      "pulse",
    ]);
  });

  it("defines micro UX timing, easing, and class primitives", () => {
    expect(microDurations.quick).toBe("120ms");
    expect(microEasings.spring).toContain("linear(");
    expect(microUxClasses.press).toContain("active:scale");
    expect(microUx("base", "liftSoft")).toContain("hover:-translate-y-px");
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
