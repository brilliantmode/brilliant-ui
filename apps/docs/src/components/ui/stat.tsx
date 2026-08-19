import type { HTMLAttributes, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const trendTones = {
  positive: "bg-primary/10 text-primary",
  negative: "bg-critical/10 text-critical",
  neutral: "bg-muted text-muted-foreground",
} as const;

export function Stat({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-[0.5rem] border-hairline border-border bg-surface p-5 shadow-sm",
        "motion-safe:transition-[border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "hover:-translate-y-px hover:border-foreground/20 hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export function StatHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("flex items-start justify-between gap-3", className)} {...props} />;
}

export function StatLabel({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("text-sm font-medium text-muted-foreground", className)} {...props} />;
}

export function StatValue({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cx("mt-2 text-2xl font-semibold tracking-tight tabular-nums", className)}
      {...props}
    />
  );
}

export function StatDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("mt-2 text-xs leading-5 text-muted-foreground", className)} {...props} />;
}

export function TrendIndicator({
  children,
  className = "",
  direction = "neutral",
  value,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  direction?: keyof typeof trendTones;
  value?: ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-6 items-center gap-1 rounded-[0.25rem] px-1.5 text-xs font-medium tabular-nums",
        trendTones[direction],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">
        {direction === "positive" ? "↗" : direction === "negative" ? "↘" : "→"}
      </span>
      {value ?? children}
    </span>
  );
}

export function Metric({
  className = "",
  label,
  value,
  ...props
}: HTMLAttributes<HTMLDivElement> & { label: ReactNode; value: ReactNode }) {
  return (
    <div className={cx("grid gap-1", className)} {...props}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}
