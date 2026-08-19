import { describe, expect, it } from "vitest";
import {
  cn,
  componentStates,
  dataStateAttributes,
  defineComponentAnatomy,
  stateClasses,
} from "./index.js";

describe("component infrastructure", () => {
  it("merges conditional classes and resolves Tailwind conflicts", () => {
    expect(cn("px-2", false && "hidden", ["px-4", "text-sm"])).toBe("px-4 text-sm");
  });

  it("defines common component states and shared classes", () => {
    expect(componentStates).toContain("focus-visible");
    expect(stateClasses.focusRing).toContain("focus-visible:ring-2");
  });

  it("records anatomy for generated component metadata", () => {
    const anatomy = defineComponentAnatomy({
      name: "button",
      slots: ["root", "icon", "label"],
      states: ["default", "disabled"],
      dataAttributes: ["data-loading"],
    });
    expect(anatomy.slots).toContain("icon");
  });

  it("creates ARIA and data attributes for shared states", () => {
    expect(dataStateAttributes({ disabled: true, invalid: true, loading: true })).toEqual({
      "aria-disabled": "true",
      "aria-invalid": "true",
      "data-loading": "true",
    });
  });
});
