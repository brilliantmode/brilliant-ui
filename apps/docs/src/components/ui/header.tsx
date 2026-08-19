"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const positions = {
  static: "relative",
  sticky: "sticky top-0",
  fixed: "fixed inset-x-0 top-0",
} as const;

const behaviors = {
  none: "",
  elevate:
    "data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/95 data-[scrolled=true]:shadow-sm",
  reveal:
    "data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/95 data-[scrolled=true]:shadow-sm data-[visibility=hidden]:-translate-y-full data-[visibility=visible]:translate-y-0",
} as const;

const navAlignments = {
  start: "md:justify-start",
  center: "md:justify-center",
  end: "md:justify-end",
} as const;

export interface HeaderScrollState {
  direction: "down" | "none" | "up";
  scrolled: boolean;
  visibility: "hidden" | "visible";
}

interface HeaderContextValue {
  closeMenu: () => void;
  menuOpen: boolean;
  toggleMenu: () => void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) throw new Error("Header parts must be rendered inside <Header>.");
  return context;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  behavior?: keyof typeof behaviors;
  defaultMenuOpen?: boolean;
  onScrollStateChange?: (state: HeaderScrollState) => void;
  position?: keyof typeof positions;
  scrollThreshold?: number;
}

export function Header({
  behavior = "elevate",
  children,
  className = "",
  defaultMenuOpen = false,
  onScrollStateChange,
  position = "sticky",
  scrollThreshold = 16,
  ...props
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(defaultMenuOpen);
  const [scrollState, setScrollState] = useState<HeaderScrollState>({
    direction: "none",
    scrolled: false,
    visibility: "visible",
  });
  const scrollStateRef = useRef(scrollState);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    let frame = 0;
    let previousY = window.scrollY;

    const updateScrollState = () => {
      const currentY = window.scrollY;
      const delta = currentY - previousY;
      const direction =
        Math.abs(delta) < 2 ? scrollStateRef.current.direction : delta > 0 ? "down" : "up";
      const scrolled = currentY > scrollThreshold;
      const visibility =
        behavior === "reveal" && scrolled && direction === "down" ? "hidden" : "visible";
      const nextState: HeaderScrollState = { direction, scrolled, visibility };
      const previousState = scrollStateRef.current;

      previousY = currentY;
      frame = 0;

      if (
        previousState.direction === nextState.direction &&
        previousState.scrolled === nextState.scrolled &&
        previousState.visibility === nextState.visibility
      ) {
        return;
      }

      scrollStateRef.current = nextState;
      setScrollState(nextState);
      onScrollStateChange?.(nextState);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [behavior, onScrollStateChange, scrollThreshold]);

  const value = useMemo(
    () => ({
      closeMenu: () => setMenuOpen(false),
      menuOpen,
      toggleMenu: () => setMenuOpen((open) => !open),
    }),
    [menuOpen],
  );

  return (
    <HeaderContext.Provider value={value}>
      <header
        className={cx(
          "z-40 w-full border-b border-transparent bg-background/80 text-foreground backdrop-blur",
          "motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transform-none motion-reduce:transition-none",
          positions[position],
          behaviors[behavior],
          className,
        )}
        data-behavior={behavior}
        data-position={position}
        data-scroll-direction={scrollState.direction}
        data-scrolled={scrollState.scrolled}
        data-visibility={scrollState.visibility}
        {...props}
      >
        {children}
      </header>
    </HeaderContext.Provider>
  );
}

export function HeaderContainer({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "relative mx-auto flex min-h-14 max-w-screen-2xl items-center gap-3 px-4 md:px-6",
        className,
      )}
      {...props}
    />
  );
}

export function HeaderBrand({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cx(
        "inline-flex shrink-0 items-center gap-2 rounded-[0.25rem] font-semibold tracking-[-0.015em] outline-none md:mr-3",
        "focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

export interface HeaderNavProps extends HTMLAttributes<HTMLElement> {
  align?: keyof typeof navAlignments;
}

export function HeaderNav({ align = "start", className = "", ...props }: HeaderNavProps) {
  const { menuOpen } = useHeader();

  return (
    <nav
      aria-label="Primary navigation"
      className={cx(
        "absolute inset-x-0 top-full grid gap-1 bg-background p-3 shadow-md max-md:border-b max-md:border-border",
        "motion-safe:origin-top motion-safe:transition-[opacity,transform,visibility] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        "md:static md:ml-0 md:flex md:visible md:translate-y-0 md:items-center md:bg-transparent md:p-0 md:opacity-100 md:shadow-none",
        navAlignments[align],
        className,
      )}
      data-align={align}
      data-state={menuOpen ? "open" : "closed"}
      {...props}
    />
  );
}

export function HeaderLink({
  active = false,
  className = "",
  href,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean; href: string }) {
  const { closeMenu } = useHeader();

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cx(
        "rounded-[0.25rem] px-3 py-2 text-sm outline-none",
        "motion-safe:transition-[color,background-color] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "focus-visible:ring-1 focus-visible:ring-ring",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) closeMenu();
      }}
    />
  );
}

export function HeaderActions({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("ml-auto flex items-center gap-2", className)} {...props} />;
}

export function HeaderMobileTrigger({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
  const { menuOpen, toggleMenu } = useHeader();

  return (
    <button
      aria-expanded={menuOpen}
      aria-label={menuOpen ? "Close navigation" : "Open navigation"}
      className={cx(
        "ml-auto inline-grid size-9 place-items-center rounded-[0.25rem] text-foreground md:hidden",
        "hover:bg-muted active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "motion-safe:transition-[background-color,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        className,
      )}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) toggleMenu();
      }}
      type={type}
    >
      {children ?? (
        <span aria-hidden="true" className="grid gap-1">
          <span
            className={cx(
              "block h-px w-4 bg-current transition-transform",
              menuOpen && "translate-y-[2.5px] rotate-45",
            )}
          />
          <span
            className={cx(
              "block h-px w-4 bg-current transition-transform",
              menuOpen && "-translate-y-[2.5px] -rotate-45",
            )}
          />
        </span>
      )}
    </button>
  );
}
