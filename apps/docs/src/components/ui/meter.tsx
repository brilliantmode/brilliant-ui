import type { HTMLAttributes, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const tones = {
  default: "bg-primary",
  warning: "bg-amber-500",
  critical: "bg-critical",
} as const;

export function Meter({
  className = "",
  label,
  max = 100,
  tone = "default",
  value,
  valueLabel,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: ReactNode;
  max?: number;
  tone?: keyof typeof tones;
  value: number;
  valueLabel?: ReactNode;
}) {
  const safeMax = max > 0 ? max : 100;
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <div className={cx("grid gap-2", className)} {...props}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {valueLabel ?? `${value} / ${safeMax}`}
        </span>
      </div>
      <meter className="sr-only" max={safeMax} min={0} value={value}>
        {percentage}%
      </meter>
      <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-muted">
        <span
          className={cx(
            "block h-full origin-left rounded-full motion-safe:transition-transform motion-safe:duration-[var(--brilliant-duration-normal)] motion-reduce:transition-none",
            tones[tone],
          )}
          style={{ transform: "scaleX(" + (percentage / 100).toString() + ")" }}
        />
      </div>
    </div>
  );
}
