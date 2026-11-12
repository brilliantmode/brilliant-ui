// @vitest-environment jsdom

import type { ReactNode } from "react";
import { act } from "react";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApplicationShell,
  ApplicationShellBrand,
  ApplicationShellNav,
  ApplicationShellNavItem,
} from "./generated/application-shell.js";
import { BreadcrumbLink } from "./generated/breadcrumb.js";
import { Button } from "./generated/button.js";
import { ButtonLink } from "./generated/button-link.js";
import { FooterLink } from "./generated/footer.js";
import { Link, type LinkProps, LinkProvider } from "./generated/link.js";
import { NavigationMenuLink } from "./generated/navigation-menu.js";
import { PaginationLink } from "./generated/pagination.js";

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const routed: string[] = [];

/** Stands in for a router link (e.g. Next.js Link): marks itself and records navigation. */
function RouterLink({ href, onClick, ...props }: LinkProps) {
  return (
    <a
      data-router-link=""
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
        routed.push(href);
      }}
    />
  );
}

function render(node: ReactNode) {
  act(() => root.render(node));
}

describe("Link", () => {
  it("renders a plain anchor without a provider", () => {
    render(<Link href="/campaigns">Campaigns</Link>);
    const anchor = host.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe("/campaigns");
    expect(anchor?.hasAttribute("data-router-link")).toBe(false);
  });

  it("renders the provided router link and keeps anchors without href plain", () => {
    render(
      <LinkProvider component={RouterLink}>
        <Link href="/creators" aria-current="page" className="x">
          Creators
        </Link>
        <Link aria-disabled="true">Disabled</Link>
      </LinkProvider>,
    );
    const [routedAnchor, plain] = host.querySelectorAll("a");
    expect(routedAnchor?.hasAttribute("data-router-link")).toBe(true);
    expect(routedAnchor?.getAttribute("aria-current")).toBe("page");
    expect(routedAnchor?.className).toBe("x");
    expect(plain?.hasAttribute("data-router-link")).toBe(false);
  });

  it("routes every navigation component through the provider", () => {
    render(
      <LinkProvider component={RouterLink}>
        <ApplicationShell>
          <ApplicationShellBrand href="/">Brand</ApplicationShellBrand>
          <ApplicationShellNav aria-label="Main">
            <ApplicationShellNavItem href="/campaigns">Campaigns</ApplicationShellNavItem>
          </ApplicationShellNav>
        </ApplicationShell>
        <BreadcrumbLink href="/a">A</BreadcrumbLink>
        <FooterLink href="/b">B</FooterLink>
        <NavigationMenuLink href="/c">C</NavigationMenuLink>
        <PaginationLink href="/d">D</PaginationLink>
        <ButtonLink href="/e">E</ButtonLink>
      </LinkProvider>,
    );
    const anchors = [...host.querySelectorAll("a")];
    expect(anchors.length).toBe(7);
    expect(anchors.every((a) => a.hasAttribute("data-router-link"))).toBe(true);
  });

  it("keeps the nav item's own click handling when routed", () => {
    routed.length = 0;
    const onClick = vi.fn();
    render(
      <LinkProvider component={RouterLink}>
        <ApplicationShell>
          <ApplicationShellNav aria-label="Main">
            <ApplicationShellNavItem href="/campaigns" onClick={onClick}>
              Campaigns
            </ApplicationShellNavItem>
          </ApplicationShellNav>
        </ApplicationShell>
      </LinkProvider>,
    );
    act(() => host.querySelector("a")?.click());
    expect(onClick).toHaveBeenCalledOnce();
    expect(routed).toEqual(["/campaigns"]);
  });

  it("ButtonLink is a single link styled exactly like the matching Button", () => {
    render(
      <>
        <ButtonLink href="/providers" variant="outline" size="sm">
          Connect a provider
        </ButtonLink>
        <Button variant="outline" size="sm">
          Connect a provider
        </Button>
      </>,
    );
    const link = host.querySelector("a");
    expect(link?.querySelector("button")).toBeNull();
    expect(link?.getAttribute("href")).toBe("/providers");
    expect(link?.className).toBe(host.querySelector("button")?.className);
  });
});
