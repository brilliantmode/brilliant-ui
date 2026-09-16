// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Combobox } from "./generated/combobox.js";

let host: HTMLDivElement;
let root: Root;
const options = [
  { label: "Acme (Acme Systems)", value: "Acme", icon: <img alt="Acme logo" src="/acme.svg" /> },
  { label: "Beta", value: "Beta", icon: <img alt="Beta logo" src="/beta.svg" /> },
  { label: "Disabled", value: "Disabled", disabled: true },
  { label: "No vendor assigned", value: "none" },
];

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

describe("Combobox option branding", () => {
  it("keeps logos decorative and shows the selected logo after keyboard selection", () => {
    const onValueChange = vi.fn();
    act(() =>
      root.render(<Combobox aria-label="Vendor" options={options} onValueChange={onValueChange} />),
    );
    const input = host.querySelector("input");
    if (!input) throw new Error("Combobox input missing");
    act(() => input.focus());
    const first = host.querySelector('[role="option"]');
    if (!first) throw new Error("Combobox option missing");
    expect(first.textContent).toBe("Acme (Acme Systems)");
    expect(first.querySelector("img")?.closest('[aria-hidden="true"]')).not.toBeNull();
    act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(input.value).toBe("Acme");
    expect(onValueChange).toHaveBeenLastCalledWith("Acme");
    expect(host.querySelector('[role="listbox"]')).toBeNull();
    expect(host.querySelector("img")?.getAttribute("src")).toBe("/acme.svg");
    expect(host.querySelector("img")?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("filters by string label and value and removes branding for unmatched or unassigned values", () => {
    const render = (value: string) =>
      act(() => root.render(<Combobox aria-label="Vendor" value={value} options={options} />));
    render("Systems");
    act(() => host.querySelector("input")?.focus());
    expect(host.querySelectorAll('[role="option"]')).toHaveLength(1);
    expect(host.querySelector('[role="option"]')?.textContent).toBe("Acme (Acme Systems)");
    render("Beta");
    expect(host.querySelectorAll('[role="option"]')).toHaveLength(1);
    expect(host.querySelector("img")?.getAttribute("src")).toBe("/beta.svg");
    render("none");
    expect(host.querySelector('[role="option"]')?.textContent).toBe("No vendor assigned");
    expect(host.querySelector("img")).toBeNull();
    render("missing");
    expect(host.querySelectorAll('[role="option"]')).toHaveLength(0);
    expect(host.textContent).toContain("No results found.");
    expect(host.querySelector("img")).toBeNull();
  });

  it("keeps disabled suggestions non-selectable with icon support enabled", () => {
    const onValueChange = vi.fn();
    act(() =>
      root.render(<Combobox aria-label="Vendor" options={options} onValueChange={onValueChange} />),
    );
    const input = host.querySelector("input");
    if (!input) throw new Error("Combobox input missing");
    act(() => input.focus());
    act(() =>
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })),
    );
    act(() =>
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })),
    );
    act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(onValueChange).toHaveBeenLastCalledWith("none");
    expect(input.value).toBe("none");
  });
});
