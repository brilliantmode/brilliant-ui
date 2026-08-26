import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Button,
  CardExpand,
  CardFlip,
  cn,
  componentStates,
  dataStateAttributes,
  defineComponentAnatomy,
  microUx,
  motion,
  QRCode,
  stateClasses,
  tokens,
} from "./index.js";

describe("component infrastructure", () => {
  it("exports protected UI components from the package root", () => {
    expect(typeof Button).toBe("function");
    expect(typeof CardFlip).toBe("function");
    expect(typeof CardExpand).toBe("function");
    expect(typeof QRCode).toBe("function");
  });

  it("renders an accessible QR Code SVG", () => {
    const markup = renderToStaticMarkup(
      createElement(QRCode, {
        title: "Open account setup",
        value: "https://example.com/setup",
      }),
    );

    expect(markup).toContain("<svg");
    expect(markup).toContain('role="img"');
    expect(markup).toContain("<title>Open account setup</title>");
    expect(markup).toContain('data-slot="root"');
    expect(markup).toContain('viewBox="0 0 ');
    expect(markup).toContain("<path");
  });

  it("optionally embeds an excavated SVG logo", () => {
    const logo =
      "data:image/svg+xml," +
      encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"/>');
    const markup = renderToStaticMarkup(
      createElement(QRCode, {
        imageSettings: { excavate: true, height: 24, src: logo, width: 24 },
        level: "H",
        value: "TOKEN-9F3A-72KC",
      }),
    );

    expect(markup).toContain("<image");
    expect(markup).toContain("data:image/svg+xml");
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
