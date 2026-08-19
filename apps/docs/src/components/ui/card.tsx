import type { HTMLAttributes } from "react";

const variants = {
  surface: "border-hairline border-border bg-surface shadow-sm",
  elevated: "border-hairline border-border bg-surface-raised shadow-md",
  accent: "border-hairline border-primary/25 bg-primary/5 shadow-sm",
  beam: "relative isolate overflow-hidden border-transparent bg-surface shadow-sm before:absolute before:-inset-8 before:z-0 before:rounded-[inherit] before:bg-[conic-gradient(from_0deg,transparent_0_68%,var(--brilliant-ring)_74%,var(--brilliant-primary)_79%,transparent_86%)] before:opacity-70 before:content-[''] motion-safe:before:animate-border-beam motion-reduce:before:animate-none after:absolute after:inset-[0.5px] after:z-0 after:rounded-[calc(0.375rem-0.5px)] after:bg-surface after:content-[''] [&>*]:relative [&>*]:z-10",
  muted: "border-hairline border-border bg-muted/45 shadow-none",
  ghost: "border-hairline border-transparent bg-transparent shadow-none",
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  beam?: boolean;
  interactive?: boolean;
  variant?: keyof typeof variants;
}

export function Card({
  beam = false,
  className = "",
  interactive = false,
  variant = "surface",
  ...props
}: CardProps) {
  const resolvedVariant = beam ? "beam" : variant;

  return (
    <div
      className={[
        "rounded-[0.375rem] text-foreground",
        "motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
        variants[resolvedVariant],
        interactive || resolvedVariant === "beam"
          ? "hover:-translate-y-px hover:border-primary/30 hover:shadow-md active:translate-y-0 active:scale-[0.995]"
          : "",
        className,
      ].join(" ")}
      data-beam={beam ? "true" : undefined}
      data-interactive={interactive ? "true" : undefined}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["space-y-1.5 p-5", className].join(" ")} {...props} />;
}

export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={["text-base font-semibold tracking-tight", className].join(" ")} {...props} />
  );
}

export function CardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={["text-sm leading-6 text-muted-foreground", className].join(" ")} {...props} />
  );
}

export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-5 pt-0", className].join(" ")} {...props} />;
}

export function CardFooter({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["flex items-center gap-3 border-t-[0.5px] border-border p-5", className].join(
        " ",
      )}
      {...props}
    />
  );
}
