import type { CSSProperties, HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const variants = {
  surface: "border-transparent bg-surface shadow-none ring-1 ring-inset ring-border",
  elevated:
    "border-transparent bg-surface-raised shadow-[0_20px_42px_-18px_oklch(0_0_0/0.48),0_8px_18px_-12px_oklch(0_0_0/0.3)] motion-safe:-translate-y-1",
  ghost: "border-transparent bg-transparent shadow-none",
} as const;

const radii = {
  sm: "rounded-[0.25rem]",
  md: "rounded-[0.5rem]",
  lg: "rounded-[0.75rem]",
  full: "rounded-full",
} as const;

const fits = {
  cover: "object-cover",
  contain: "object-contain",
} as const;

const crops = {
  rectangle: "",
  square: "",
  circle: "rounded-full",
} as const;

const filters = {
  none: "none",
  mono: "grayscale(1) contrast(1.05)",
  soft: "saturate(0.82) contrast(0.94) brightness(1.04)",
  vivid: "saturate(1.22) contrast(1.06)",
  warm: "sepia(0.2) saturate(1.1) hue-rotate(-8deg)",
  cool: "saturate(0.9) hue-rotate(8deg) contrast(1.02)",
} as const;

export interface PhotoProps extends HTMLAttributes<HTMLElement> {
  crop?: keyof typeof crops;
  ratio?: number | string;
  radius?: keyof typeof radii;
  variant?: keyof typeof variants;
}

export function Photo({
  children,
  className = "",
  crop = "rectangle",
  ratio = 4 / 3,
  radius = "md",
  style,
  variant = "surface",
  ...props
}: PhotoProps) {
  return (
    <figure
      className={cx(
        "relative isolate overflow-hidden border-hairline",
        "motion-safe:transition-[border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        variants[variant],
        radii[radius],
        crops[crop],
        className,
      )}
      data-crop={crop}
      style={
        {
          ...style,
          aspectRatio: crop === "rectangle" ? (style?.aspectRatio ?? String(ratio)) : "1",
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </figure>
  );
}

export interface PhotoImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  filter?: keyof typeof filters;
  fit?: keyof typeof fits;
}

export function PhotoImage({
  alt,
  className = "",
  filter = "none",
  fit = "cover",
  onError,
  onLoad,
  style,
  ...props
}: PhotoImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      alt={alt}
      className={cx(
        "absolute inset-0 size-full transition-[opacity,transform,filter] duration-[var(--brilliant-duration-normal)] ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
        loaded ? "scale-100 opacity-100 blur-0" : "scale-[1.015] opacity-0 blur-sm",
        fits[fit],
        className,
      )}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      style={{
        ...style,
        filter: filter === "none" ? style?.filter : filters[filter],
      }}
      data-filter={filter}
      {...props}
    />
  );
}

export interface PhotoTintProps extends HTMLAttributes<HTMLSpanElement> {
  blendMode?: CSSProperties["mixBlendMode"];
  color?: string;
  opacity?: number;
}

export function PhotoTint({
  blendMode = "color",
  className = "",
  color = "var(--brilliant-primary)",
  opacity = 0.22,
  style,
  ...props
}: PhotoTintProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0 transition-[background-color,opacity] duration-[var(--brilliant-duration-normal)] motion-reduce:transition-none",
        className,
      )}
      style={{
        ...style,
        backgroundColor: color,
        mixBlendMode: blendMode,
        opacity,
      }}
      {...props}
    />
  );
}

export interface PhotoFallbackProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
}

export function PhotoFallback({
  children,
  className = "",
  icon = "◌",
  ...props
}: PhotoFallbackProps) {
  return (
    <div
      className={cx(
        "absolute inset-0 grid place-items-center bg-muted text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span className="grid gap-2">
        <span className="text-lg leading-none text-muted-foreground/70" aria-hidden="true">
          {icon}
        </span>
        {children ? <span>{children}</span> : null}
      </span>
    </div>
  );
}

export function PhotoCaption({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <figcaption
      className={cx(
        "absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent px-3 pt-8 pb-3 text-xs font-medium text-background",
        className,
      )}
      {...props}
    />
  );
}
