import type { HTMLAttributes } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DashboardLayout({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("grid min-w-0 gap-6", className)} {...props} />;
}

export function DashboardHeader({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cx("flex flex-wrap items-start justify-between gap-4", className)}
      {...props}
    />
  );
}

export function DashboardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cx("text-2xl font-semibold tracking-tight", className)} {...props} />;
}

export function DashboardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("mt-1 text-sm leading-6 text-muted-foreground", className)} {...props} />;
}

export function DashboardActions({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("flex flex-wrap items-center gap-2", className)} {...props} />;
}

export function DashboardGrid({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4", className)} {...props} />
  );
}

export function DashboardSection({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cx("grid min-w-0 gap-4", className)} {...props} />;
}

export function DashboardSectionHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-between gap-3", className)}
      {...props}
    />
  );
}

export function DashboardSectionTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cx("text-base font-semibold tracking-tight", className)} {...props} />;
}
