import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

const variants = {
  surface: "border-t border-border bg-background",
  muted: "border-t border-border bg-muted/45",
  transparent: "bg-transparent",
} as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  variant?: keyof typeof variants;
}

export function Footer({ className = "", variant = "surface", ...props }: FooterProps) {
  return (
    <footer
      className={cx("w-full text-sm text-muted-foreground", variants[variant], className)}
      data-variant={variant}
      {...props}
    />
  );
}

export function FooterContainer({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("mx-auto w-full max-w-screen-2xl px-4 py-10 md:px-6 md:py-12", className)}
      {...props}
    />
  );
}

export function FooterMain({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]", className)}
      {...props}
    />
  );
}

export function FooterBrand({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cx(
        "inline-flex items-center gap-2 rounded-[0.25rem] font-semibold tracking-[-0.015em] text-foreground outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

export function FooterDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("mt-3 max-w-sm leading-6", className)} {...props} />;
}

export function FooterNav({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      aria-label="Footer navigation"
      className={cx("grid grid-cols-2 gap-8 sm:grid-cols-3", className)}
      {...props}
    />
  );
}

export function FooterGroup({
  children,
  className = "",
  title,
  ...props
}: HTMLAttributes<HTMLDivElement> & { title: string }) {
  return (
    <div className={cx("grid content-start gap-2", className)} {...props}>
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function FooterLink({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cx(
        "w-fit rounded-[0.2rem] leading-6 outline-none hover:text-foreground",
        "motion-safe:transition-colors motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

export function FooterBottom({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "mt-10 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    />
  );
}
