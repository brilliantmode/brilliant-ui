import { describe, expect, it } from "vitest";
import { iconProps, iconSizes, iconStrokes } from "./index.js";

describe("icon contracts", () => {
  it("defines stable icon sizes and strokes", () => {
    expect(iconSizes.md).toBe(16);
    expect(iconStrokes.regular).toBe(2);
  });

  it("defaults unlabeled icons to decorative", () => {
    expect(iconProps()).toMatchObject({ "aria-hidden": true, focusable: false, size: 16 });
  });

  it("creates accessible props for meaningful icons", () => {
    expect(iconProps({ label: "Search", size: "lg" })).toMatchObject({
      "aria-label": "Search",
      focusable: false,
      size: 20,
    });
  });
});
