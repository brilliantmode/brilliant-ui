import { describe, expect, it } from "vitest";
import {
  Button,
  cn,
  componentStates,
  dataStateAttributes,
  defineComponentAnatomy,
  microUx,
  motion,
  stateClasses,
  tokens,
} from "./index.js";

describe("component infrastructure", () => {
  it("exports protected UI components from the package root", () => {
    expect(typeof Button).toBe("function");
  });

  it("merges conditional classes and resolves Tailwind conflicts", () => {
    expect(cn("px-2", false && "hidden", ["px-4", "text-sm"])).toBe("px-4 text-sm");
  });

  it("defines common component states and shared classes", () => {
    expect(componentStates).toContain("focus-visible");
    expect(stateClasses.focusRing).toContain("focus-visible:ring-1");
    expect(microUx("base", "press")).toContain("active:scale");
  });

  it("ships tokens and animations from the public package", () => {
    expect(tokens.motion).toBe(motion);
    expect(microUx("base")).toContain("--brilliant-duration-fast");
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
