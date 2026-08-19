"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const positions = {
  static: "relative",
  sticky: "sticky top-0",
  fixed: "fixed inset-x-0 top-0",
} as const;

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
  defaultMenuOpen?: boolean;
  position?: keyof typeof positions;
}

export function Header({
  children,
  className = "",
  defaultMenuOpen = false,
  position = "sticky",
  ...props
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(defaultMenuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

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
          "z-40 w-full border-b border-border bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/82",
          "motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
          positions[position],
          className,
        )}
        data-position={position}
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
        "inline-flex shrink-0 items-center gap-2 rounded-[0.25rem] font-semibold tracking-[-0.015em] outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

export function HeaderNav({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  const { menuOpen } = useHeader();

  return (
    <nav
      aria-label="Primary navigation"
      className={cx(
        "absolute inset-x-0 top-full grid gap-1 border-b border-border bg-background p-3 shadow-md",
        "motion-safe:origin-top motion-safe:transition-[opacity,transform,visibility] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        "md:static md:ml-4 md:flex md:visible md:translate-y-0 md:items-center md:border-0 md:bg-transparent md:p-0 md:opacity-100 md:shadow-none",
        className,
      )}
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
