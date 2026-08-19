"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useId } from "react";
import {
  type DefaultLegendContentProps,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
} from "recharts";

export type ChartConfig = Record<
  string,
  {
    color?: string;
    label?: ReactNode;
  }
>;

const ChartContext = createContext<ChartConfig | null>(null);

function useChartConfig() {
  const config = useContext(ChartContext);
  if (!config) throw new Error("Chart parts must be rendered inside <ChartContainer>.");
  return config;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  description?: string;
  title: string;
}

export function ChartContainer({
  children,
  className = "",
  config,
  description,
  style,
  title,
  ...props
}: ChartContainerProps) {
  const generatedId = useId();
  const titleId = generatedId + "-title";
  const descriptionId = generatedId + "-description";
  const colorVariables = Object.fromEntries(
    Object.entries(config).map(([key, item]) => ["--color-" + key, item.color ?? "currentColor"]),
  ) as CSSProperties;

  return (
    <ChartContext.Provider value={config}>
      <figure
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        className={cx(
          "relative min-h-64 w-full text-xs text-muted-foreground",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/70 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        style={{ ...colorVariables, ...style }}
        {...props}
      >
        <figcaption className="sr-only" id={titleId}>
          {title}
        </figcaption>
        {description ? (
          <span className="sr-only" id={descriptionId}>
            {description}
          </span>
        ) : null}
        <ResponsiveContainer height="100%" minHeight={1} minWidth={0} width="100%">
          {children}
        </ResponsiveContainer>
      </figure>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Tooltip;
export const ChartLegend = Legend;

export function ChartTooltipContent({
  active,
  className = "",
  hideLabel = false,
  label,
  payload,
}: Partial<TooltipContentProps<number | string, number | string>> & {
  className?: string;
  hideLabel?: boolean;
}) {
  const config = useChartConfig();
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cx(
        "grid min-w-36 gap-2 rounded-[0.375rem] border-hairline border-border bg-surface/96 px-3 py-2 text-xs text-foreground shadow-md backdrop-blur",
        "motion-safe:animate-enter motion-reduce:animate-none",
        className,
      )}
    >
      {!hideLabel && label !== undefined ? <p className="font-medium">{label}</p> : null}
      <div className="grid gap-1.5">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "value");
          const itemConfig = config[key];
          return (
            <div className="flex items-center gap-2" key={key}>
              <span
                aria-hidden="true"
                className="size-2 rounded-[0.125rem]"
                style={{ background: item.color ?? itemConfig?.color }}
              />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {itemConfig?.label ?? item.name ?? key}
              </span>
              <span className="font-mono font-medium tabular-nums text-foreground">
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartLegendContent({
  className = "",
  payload,
}: DefaultLegendContentProps & { className?: string }) {
  const config = useChartConfig();
  if (!payload?.length) return null;

  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3", className)}
    >
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.value);
        return (
          <span
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            key={key}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-[0.125rem]"
              style={{ background: item.color }}
            />
            {config[key]?.label ?? item.value}
          </span>
        );
      })}
    </div>
  );
}

export interface SparklineProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  color?: string;
  data: readonly number[];
  label: string;
}

export function Sparkline({
  className = "",
  color = "var(--brilliant-chart-1)",
  data,
  label,
  ...props
}: SparklineProps) {
  const points = data.map((value, index) => ({ index, value }));

  return (
    <div className={cx("h-10 w-28", className)} {...props}>
      <ResponsiveContainer height="100%" minHeight={1} minWidth={0} width="100%">
        <LineChart
          accessibilityLayer
          data={points}
          margin={{ bottom: 2, left: 2, right: 2, top: 2 }}
        >
          <title>{label}</title>
          <Line
            dataKey="value"
            dot={false}
            isAnimationActive="auto"
            stroke={color}
            strokeLinecap="round"
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const stateStyles = {
  empty: "border-border bg-muted/35 text-muted-foreground",
  error: "border-critical/30 bg-critical/5 text-critical",
  loading: "border-border bg-muted/35 text-muted-foreground",
} as const;

export function ChartState({
  children,
  className = "",
  state = "empty",
  ...props
}: HTMLAttributes<HTMLDivElement> & { state?: keyof typeof stateStyles }) {
  return (
    <div
      className={cx(
        "grid min-h-64 place-items-center rounded-[0.375rem] border-hairline border-dashed p-6 text-center text-sm",
        stateStyles[state],
        state === "loading" && "motion-safe:animate-pulse motion-reduce:animate-none",
        className,
      )}
      role={state === "error" ? "alert" : "status"}
      {...props}
    >
      {children ??
        (state === "loading"
          ? "Loading chart…"
          : state === "error"
            ? "Chart unavailable"
            : "No data for this period")}
    </div>
  );
}
