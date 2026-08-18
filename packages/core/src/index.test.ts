import { describe, expect, it } from "vitest";
import { cx, defaultConfig } from "./index.js";

describe("cx", () => {
  it("composes nested values and conditional maps", () => {
    expect(cx("base", ["nested", false], { active: true, hidden: false })).toBe(
      "base nested active",
    );
  });
});

describe("defaultConfig", () => {
  it("uses source ownership defaults compatible with shadcn projects", () => {
    expect(defaultConfig.aliases.components).toBe("@/components");
    expect(defaultConfig.tailwind.cssVariables).toBe(true);
  });
});
