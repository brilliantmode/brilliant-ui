// @vitest-environment jsdom

import type { ReactNode } from "react";
import { act, createRef } from "react";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AlertDialog } from "./generated/alert-dialog.js";
import { Dialog } from "./generated/dialog.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./generated/dropdown-menu.js";
import { Input } from "./generated/input.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./generated/select.js";
import { Textarea } from "./generated/textarea.js";
import { ToastProvider, useToast } from "./generated/toast.js";

let host: HTMLDivElement;
let root: Root;

beforeEach(({ task }) => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
  // Floating UI probes native top-layer selectors which JSDOM cannot resolve.
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, "matches").mockImplementation(function (
    this: Element,
    selector: string,
  ) {
    if (selector === ":popover-open" || selector === ":modal") return false;
    return matches.call(this, selector);
  });
  // JSDOM does not implement the browser top layer. Simulate only :modal matching;
  // portal ownership and React/Radix behavior below run against the real DOM tree.
  if (task.name.includes("toast")) {
    const query = document.querySelectorAll.bind(document);
    vi.spyOn(document, "querySelectorAll").mockImplementation(((selector: string) =>
      query(
        selector === "dialog:modal" ? "dialog[data-test-modal][open]" : selector,
      )) as typeof document.querySelectorAll);
    const closest = Element.prototype.closest;
    vi.spyOn(Element.prototype, "closest").mockImplementation(function (
      this: Element,
      selector: string,
    ) {
      return closest.call(
        this,
        selector === "dialog:modal" ? "dialog[data-test-modal][open]" : selector,
      );
    });
  }
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  document.body.style.pointerEvents = "";
  delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function render(children: ReactNode) {
  await act(async () => root.render(children));
}

function Notify() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: "Saved", description: "Changes stored" })} type="button">
      Notify
    </button>
  );
}

async function notify() {
  const button = host.querySelector<HTMLButtonElement>("button");
  expect(button).not.toBeNull();
  await act(async () => button?.click());
}

describe("native dialog composition", () => {
  it("forwards typed React 19 refs to the native input, textarea and dialog elements", async () => {
    const input = createRef<HTMLInputElement>();
    const textarea = createRef<HTMLTextAreaElement>();
    const dialog = createRef<HTMLDialogElement>();
    const alert = createRef<HTMLDialogElement>();
    await render(
      <>
        <Input ref={input} />
        <Textarea ref={textarea} />
        <Dialog ref={dialog} />
        <AlertDialog ref={alert} />
      </>,
    );
    expect(input.current).toBeInstanceOf(HTMLInputElement);
    expect(textarea.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(dialog.current).toBeInstanceOf(HTMLDialogElement);
    expect(alert.current).toBeInstanceOf(HTMLDialogElement);
    input.current?.focus();
    expect(document.activeElement).toBe(input.current);
  });

  it.each([true, false])(
    "keeps a select in its dialog (inside dialog: %s) and handles Escape",
    async (inside) => {
      const content = (
        <Select defaultOpen>
          <SelectTrigger aria-label="Status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
      );
      await render(inside ? <Dialog open>{content}</Dialog> : content);
      const menu = document.querySelector('[role="listbox"]');
      expect(menu).not.toBeNull();
      expect(menu?.closest("dialog")).toBe(inside ? host.querySelector("dialog") : null);
      await act(async () =>
        menu?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })),
      );
      expect(document.querySelector('[role="listbox"]')).toBeNull();
    },
  );

  it.each([true, false])(
    "keeps a dropdown in its dialog (inside dialog: %s) and allows selection",
    async (inside) => {
      const onSelect = vi.fn();
      const content = (
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onSelect}>Copy</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      await render(inside ? <Dialog open>{content}</Dialog> : content);
      const item = document.querySelector<HTMLElement>('[role="menuitem"]');
      expect(item).not.toBeNull();
      expect(item?.closest("dialog")).toBe(inside ? host.querySelector("dialog") : null);
      await act(async () => item?.click());
      expect(onSelect).toHaveBeenCalledOnce();
      expect(document.querySelector('[role="menu"]')).toBeNull();
    },
  );

  it.each(["close", "unmount", "attribute"])(
    "preserves a modal toast after dialog %s",
    async (transition) => {
      await render(
        <ToastProvider>
          <Dialog open data-test-modal>
            <Notify />
          </Dialog>
        </ToastProvider>,
      );
      await notify();
      const dialog = host.querySelector<HTMLDialogElement>("dialog");
      expect(document.querySelector('[role="status"]')?.closest("dialog")).toBe(dialog);
      if (transition === "unmount") {
        await render(
          <ToastProvider>
            <Notify />
          </ToastProvider>,
        );
      } else {
        await act(async () => {
          if (dialog) dialog.open = false;
          if (transition === "close") dialog?.dispatchEvent(new Event("close"));
        });
      }
      const toast = document.querySelector('[role="status"]');
      expect(toast?.textContent).toContain("Changes stored");
      expect(toast?.closest("dialog")).toBeNull();
      const dismiss = toast?.querySelector<HTMLButtonElement>('button[aria-label="Dismiss toast"]');
      await act(async () => dismiss?.click());
      expect(document.querySelector('[role="status"]')).toBeNull();
    },
  );

  it("does not treat a nonmodal open dialog as the toast host", async () => {
    await render(
      <ToastProvider>
        <Dialog open>
          <Notify />
        </Dialog>
      </ToastProvider>,
    );
    await notify();
    expect(document.querySelector('[role="status"]')?.closest("dialog")).toBeNull();
  });
});
