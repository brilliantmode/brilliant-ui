import type { HTMLAttributes, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const tones = {
  neutral: "bg-muted-foreground",
  positive: "bg-primary",
  warning: "bg-amber-500",
  critical: "bg-critical",
} as const;

export function Status({
  children,
  className = "",
  pulse = false,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  pulse?: boolean;
  tone?: keyof typeof tones;
}) {
  return (
    <span className={cx("inline-flex items-center gap-2 text-sm", className)} {...props}>
      <span className="relative flex size-2" aria-hidden="true">
        {pulse ? (
          <span
            className={cx(
              "absolute inline-flex size-full rounded-full opacity-40 motion-safe:animate-ping motion-reduce:animate-none",
              tones[tone],
            )}
          />
        ) : null}
        <span className={cx("relative inline-flex size-2 rounded-full", tones[tone])} />
      </span>
      {children}
    </span>
  );
}

export interface StatusBarItem {
  label: ReactNode;
  tone?: keyof typeof tones;
  value: number;
}

export function StatusBar({
  "aria-label": ariaLabel = "Status distribution",
  className = "",
  items,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  items: readonly StatusBarItem[];
}) {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1;

  return (
    <div className={cx("grid gap-2", className)} {...props}>
      <div
        aria-label={ariaLabel}
        className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
        role="img"
      >
        {items.map((item, index) => (
          <span
            className={cx(
              "h-full origin-left motion-safe:animate-enter motion-reduce:animate-none",
              tones[item.tone ?? "neutral"],
            )}
            key={index}
            style={{ width: ((Math.max(0, item.value) / total) * 100).toString() + "%" }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map((item, index) => (
          <Status
            className="text-xs text-muted-foreground"
            key={index}
            tone={item.tone ?? "neutral"}
          >
            {item.label}{" "}
            <span className="font-mono tabular-nums text-foreground">{item.value}</span>
          </Status>
        ))}
      </div>
    </div>
  );
}
