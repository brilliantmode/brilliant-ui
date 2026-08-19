export const registryKinds = [
  "component",
  "block",
  "template",
  "theme",
  "layout",
  "animation",
] as const;

export type RegistryKind = (typeof registryKinds)[number];

export const registrySchemaVersion = 1;

export interface RegistryFile {
  readonly path: string;
  readonly content: string;
  readonly target?: string;
  readonly checksum?: string;
}

export interface RegistryMetadata {
  readonly purpose: string;
  readonly slots: readonly string[];
  readonly accessibility: readonly string[];
  readonly usage: readonly string[];
  readonly avoid: readonly string[];
}

export interface RegistryItem {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly kind: RegistryKind;
  readonly dependencies: readonly string[];
  readonly registryDependencies: readonly string[];
  readonly files: readonly RegistryFile[];
  readonly metadata: RegistryMetadata;
}

export interface RegistryIndex {
  readonly version: typeof registrySchemaVersion;
  readonly items: readonly Omit<RegistryItem, "files">[];
}

export interface RegistryItemArtifact extends RegistryItem {
  readonly version: typeof registrySchemaVersion;
  readonly files: readonly (RegistryFile & { readonly checksum: string })[];
}

export interface RegistryArtifacts {
  readonly index: RegistryIndex;
  readonly items: Readonly<Record<string, RegistryItemArtifact>>;
}

export const registryItemSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://brilliant-ui.dev/schemas/registry-item.json",
  type: "object",
  required: [
    "name",
    "title",
    "description",
    "kind",
    "dependencies",
    "registryDependencies",
    "files",
    "metadata",
  ],
  additionalProperties: false,
  properties: {
    name: { type: "string", pattern: "^[a-z0-9-]+$" },
    title: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 1 },
    kind: { enum: registryKinds },
    dependencies: { type: "array", items: { type: "string" } },
    registryDependencies: { type: "array", items: { type: "string" } },
    files: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["path", "content"],
        additionalProperties: false,
        properties: {
          path: { type: "string", minLength: 1 },
          target: { type: "string", minLength: 1 },
          content: { type: "string" },
          checksum: { type: "string" },
        },
      },
    },
    metadata: {
      type: "object",
      required: ["purpose", "slots", "accessibility", "usage", "avoid"],
      additionalProperties: false,
      properties: {
        purpose: { type: "string", minLength: 1 },
        slots: { type: "array", items: { type: "string" } },
        accessibility: { type: "array", items: { type: "string" } },
        usage: { type: "array", items: { type: "string" } },
        avoid: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

const buttonSource = `import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:-translate-y-px hover:bg-primary/92 active:translate-y-0 active:scale-[0.99] active:bg-primary/88",
  secondary:
    "border-hairline border-border bg-surface text-foreground shadow-sm hover:-translate-y-px hover:border-foreground/40 hover:bg-muted hover:shadow-md active:translate-y-0 active:scale-[0.99] active:bg-secondary active:shadow-sm",
  outline:
    "border-hairline border-border bg-background text-foreground hover:border-foreground/50 hover:bg-muted active:scale-[0.99] active:bg-secondary",
  ghost:
    "border-hairline border-transparent text-foreground hover:bg-muted active:scale-[0.99] active:bg-secondary",
  critical:
    "border-hairline border-critical bg-critical text-critical-foreground shadow-sm hover:-translate-y-px hover:bg-critical/92 hover:shadow-md active:translate-y-0 active:scale-[0.99] active:bg-critical/88 active:shadow-sm",
} as const;

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-[1.125rem] text-sm",
  icon: "size-9 px-0",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  className = "",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "relative isolate inline-flex shrink-0 appearance-none items-center justify-center gap-2 rounded-[0.25rem] font-medium tracking-[-0.005em]",
        "motion-safe:transition-[color,background-color,border-color,box-shadow,transform,opacity] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      type={type}
      {...props}
    />
  );
}
`;

const buttonGroupSource = `import type { HTMLAttributes } from "react";

const orientations = {
  horizontal:
    "flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
  vertical:
    "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
} as const;

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: keyof typeof orientations;
}

export function ButtonGroup({
  className = "",
  orientation = "horizontal",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      className={[
        "inline-flex items-stretch [&>*]:relative [&>*]:z-0 [&>*:focus-visible]:z-10",
        orientations[orientation],
        className,
      ].join(" ")}
      data-orientation={orientation}
      role="group"
      {...props}
    />
  );
}
`;

const badgeSource = `import type { HTMLAttributes } from "react";

const variants = {
  neutral: "border-border bg-muted text-foreground",
  primary: "border-primary/20 bg-primary/10 text-primary",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  critical: "border-critical/20 bg-critical/10 text-critical",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className = "", variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex h-6 shrink-0 items-center rounded-[0.25rem] border-hairline px-2 text-xs font-medium tracking-[-0.005em]",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
`;

const aspectRatioSource = `import type { CSSProperties, HTMLAttributes } from "react";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export function AspectRatio({
  className = "",
  ratio = 16 / 9,
  style,
  ...props
}: AspectRatioProps) {
  return (
    <div
      className={["relative overflow-hidden rounded-[0.5rem]", className].join(" ")}
      style={{ aspectRatio: String(ratio), ...style } as CSSProperties}
      {...props}
    />
  );
}
`;

const photoSource = `import { useState } from "react";
import type { CSSProperties, HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";

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

export interface PhotoProps extends HTMLAttributes<HTMLFigureElement> {
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
      style={{
        ...style,
        aspectRatio: crop === "rectangle" ? (style?.aspectRatio ?? String(ratio)) : "1",
      } as CSSProperties}
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

export function PhotoFallback({ children, className = "", icon = "◌", ...props }: PhotoFallbackProps) {
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
`;

const avatarSource = `import { useState } from "react";
import type { HTMLAttributes, ImgHTMLAttributes } from "react";

const sizes = {
  sm: {
    root: "size-7 text-xs",
    status: "size-2",
  },
  md: {
    root: "size-9 text-sm",
    status: "size-2.5",
  },
  lg: {
    root: "size-11 text-base",
    status: "size-3",
  },
  xl: {
    root: "size-14 text-lg",
    status: "size-3.5",
  },
} as const;

const statuses = {
  online: "bg-primary",
  busy: "bg-critical",
  offline: "bg-muted-foreground",
} as const;

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizes;
}

export function Avatar({ className = "", size = "md", ...props }: AvatarProps) {
  return (
    <div
      className={[
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-[inset_0_0_0_0.5px_var(--brilliant-control-border)]",
        "motion-safe:transition-[box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        sizes[size].root,
        className,
      ].join(" ")}
      data-size={size}
      {...props}
    />
  );
}

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export function AvatarImage({ className = "", onError, ...props }: AvatarImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      className={[
        "absolute inset-0 size-full rounded-full object-cover motion-safe:animate-enter motion-reduce:animate-none",
        className,
      ].join(" ")}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}

export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {}

export function AvatarFallback({ className = "", ...props }: AvatarFallbackProps) {
  return (
    <span
      className={[
        "grid size-full place-items-center overflow-hidden rounded-full font-medium uppercase tracking-[-0.01em]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export interface AvatarStatusProps extends HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof sizes;
  status?: keyof typeof statuses;
}

export function AvatarStatus({
  className = "",
  size = "md",
  status = "online",
  ...props
}: AvatarStatusProps) {
  return (
    <span
      aria-label={status}
      className={[
        "absolute right-0 bottom-0 rounded-full border-2 border-background shadow-sm",
        "motion-safe:transition-transform motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-spring)] motion-reduce:transition-none",
        statuses[status],
        sizes[size].status,
        className,
      ].join(" ")}
      role="status"
      {...props}
    />
  );
}
`;

const textSource = `import type { CSSProperties, ElementType, HTMLAttributes } from "react";

const variants = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  glow: "text-primary drop-shadow-[0_0_14px_var(--brilliant-primary)]",
  shimmer:
    "bg-[linear-gradient(110deg,var(--brilliant-text-shimmer-base)_0%,var(--brilliant-text-shimmer-text)_18%,var(--brilliant-text-shimmer-highlight)_34%,var(--brilliant-text-shimmer-text)_50%,var(--brilliant-text-shimmer-base)_66%)] bg-[length:240%_100%] bg-clip-text text-transparent motion-safe:animate-text-shimmer motion-reduce:animate-none motion-reduce:bg-none motion-reduce:text-foreground",
} as const;

const sizes = {
  sm: "text-sm leading-5",
  md: "text-base leading-6",
  lg: "text-lg leading-7",
  xl: "text-2xl leading-8 tracking-tight",
} as const;

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  shimmerColor?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export function Text({
  as: Component = "p",
  className = "",
  shimmerColor,
  size = "md",
  style,
  variant = "default",
  ...props
}: TextProps) {
  const shimmerStyle =
    shimmerColor === undefined
      ? style
      : ({
          ...(style ?? {}),
          "--brilliant-text-shimmer-highlight": shimmerColor,
        } as CSSProperties);

  return (
    <Component
      className={[
        "font-medium tracking-[-0.01em]",
        sizes[size],
        variants[variant],
        className,
      ].join(" ")}
      data-variant={variant}
      style={shimmerStyle}
      {...props}
    />
  );
}
`;

const cardSource = `import type { HTMLAttributes } from "react";

const variants = {
  surface: "border-hairline border-border bg-surface shadow-sm",
  elevated: "border-hairline border-border bg-surface-raised shadow-md",
  accent: "border-hairline border-primary/25 bg-primary/5 shadow-sm",
  beam:
    "relative isolate overflow-hidden border-transparent bg-surface shadow-sm before:absolute before:-inset-8 before:z-0 before:rounded-[inherit] before:bg-[conic-gradient(from_0deg,transparent_0_68%,var(--brilliant-ring)_74%,var(--brilliant-primary)_79%,transparent_86%)] before:opacity-70 before:content-[''] motion-safe:before:animate-border-beam motion-reduce:before:animate-none after:absolute after:inset-[0.5px] after:z-0 after:rounded-[calc(0.375rem-0.5px)] after:bg-surface after:content-[''] [&>*]:relative [&>*]:z-10",
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
    <h3
      className={["text-base font-semibold tracking-tight", className].join(" ")}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["text-sm leading-6 text-muted-foreground", className].join(" ")} {...props} />;
}

export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-5 pt-0", className].join(" ")} {...props} />;
}

export function CardFooter({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["flex items-center gap-3 border-t-[0.5px] border-border p-5", className].join(" ")}
      {...props}
    />
  );
}
`;

const inputSource = `import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", type = "text", ...props }: InputProps) {
  return (
    <input
      className={[
        "flex h-9 w-full rounded-[0.25rem] border-0 bg-background px-3 text-sm text-foreground shadow-[inset_0_0_0_1px_var(--brilliant-control-border)]",
        "placeholder:text-muted-foreground",
        "appearance-none motion-safe:transition-[background-color,box-shadow] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:outline-none focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-critical aria-invalid:ring-critical",
        className,
      ].join(" ")}
      type={type}
      {...props}
    />
  );
}
`;

const labelSource = `import type { LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={[
        "text-sm font-medium leading-none text-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
`;

const textareaSource = `import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={[
        "flex min-h-24 w-full rounded-[0.25rem] border-0 bg-background px-3 py-2 text-sm text-foreground shadow-[inset_0_0_0_1px_var(--brilliant-control-border)]",
        "placeholder:text-muted-foreground",
        "appearance-none motion-safe:transition-[background-color,box-shadow] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:outline-none focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-critical aria-invalid:ring-critical",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
`;

const checkboxSource = `import { useEffect, useRef } from "react";
import type { InputHTMLAttributes } from "react";

const variants = {
  default: {
    control:
      "border-control-border bg-background text-primary-foreground peer-checked:border-primary peer-checked:bg-primary peer-checked:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)] peer-indeterminate:border-primary peer-indeterminate:bg-primary peer-indeterminate:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)]",
    indicator: "text-primary-foreground",
  },
  critical: {
    control:
      "border-control-border bg-background text-critical-foreground peer-checked:border-critical peer-checked:bg-critical peer-indeterminate:border-critical peer-indeterminate:bg-critical",
    indicator: "text-critical-foreground",
  },
} as const;

const sizes = {
  sm: {
    root: "size-4",
    control: "size-4 rounded-[0.25rem]",
    indicator: "size-3",
  },
  md: {
    root: "size-5",
    control: "size-5 rounded-[0.3125rem]",
    indicator: "size-3.5",
  },
  lg: {
    root: "size-6",
    control: "size-6 rounded-[0.375rem]",
    indicator: "size-4",
  },
} as const;

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export function Checkbox({
  className = "",
  indeterminate = false,
  size = "md",
  variant = "default",
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <span
      className={[
        "relative inline-grid shrink-0 place-items-center",
        sizes[size].root,
        className,
      ].join(" ")}
    >
      <input
        className={[
          "peer absolute inset-0 z-10 cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed",
          sizes[size].control,
        ].join(" ")}
        data-variant={variant}
        ref={inputRef}
        type="checkbox"
        {...props}
      />
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none grid place-items-center border-hairline shadow-[inset_0_1px_0_color-mix(in_oklch,white_70%,transparent),inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_12%,transparent)]",
          "motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
          "peer-hover:shadow-[inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_18%,transparent),0_1px_2px_oklch(0_0_0/0.06)]",
          "peer-active:scale-[0.92] peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-0 peer-disabled:opacity-50",
          "peer-checked:[&_[data-check]]:opacity-100 peer-checked:[&_[data-check]]:motion-safe:scale-100 peer-indeterminate:[&_[data-check]]:hidden",
          "peer-indeterminate:[&_[data-mixed]]:opacity-100 peer-indeterminate:[&_[data-mixed]]:motion-safe:scale-100",
          sizes[size].control,
          variants[variant].control,
        ].join(" ")}
      >
        <svg
          aria-hidden="true"
          className={[
            "opacity-0 motion-safe:scale-75 motion-safe:transition-[opacity,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
            sizes[size].indicator,
            variants[variant].indicator,
          ].join(" ")}
          data-check=""
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 16 16"
        >
          <path d="M3.75 8.25 6.5 11l5.75-6" />
        </svg>
        <svg
          aria-hidden="true"
          className={[
            "absolute opacity-0 motion-safe:scale-75 motion-safe:transition-[opacity,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
            sizes[size].indicator,
            variants[variant].indicator,
          ].join(" ")}
          data-mixed=""
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
          viewBox="0 0 16 16"
        >
          <path d="M4 8h8" />
        </svg>
      </span>
    </span>
  );
}
`;

const switchSource = `import { useState } from "react";
import type { InputHTMLAttributes } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export function Switch({
  checked,
  className = "",
  defaultChecked,
  onChange,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? Boolean(checked) : internalChecked;

  return (
    <span
      className={[
        "relative inline-grid h-6 w-10 shrink-0 place-items-center",
        className,
      ].join(" ")}
    >
      <input
        aria-checked={resolvedChecked}
        checked={resolvedChecked}
        className="peer absolute inset-0 z-10 h-6 w-10 cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-not-allowed"
        onChange={(event) => {
          if (!isControlled) setInternalChecked(event.currentTarget.checked);
          onChange?.(event);
        }}
        role="switch"
        type="checkbox"
        {...props}
      />
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none h-6 w-10 rounded-full border-hairline border-transparent bg-secondary shadow-inner",
          "motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
          "peer-checked:bg-primary peer-checked:shadow-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-0 peer-disabled:opacity-50",
        ].join(" ")}
      />
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute left-0.5 size-5 rounded-full bg-surface shadow-sm will-change-transform",
          "motion-safe:transition-[transform,box-shadow] motion-safe:duration-[var(--brilliant-duration-normal)] motion-safe:ease-[var(--brilliant-ease-spring)] motion-reduce:transition-none",
          "peer-hover:shadow-sm peer-active:scale-x-110 peer-active:scale-y-90 peer-checked:translate-x-4 peer-checked:shadow-sm",
        ].join(" ")}
      />
    </span>
  );
}
`;

const radioGroupSource = `import type { FieldsetHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

const variants = {
  default: {
    control:
      "border-control-border bg-background peer-checked:border-primary peer-checked:bg-primary",
    indicator: "bg-primary-foreground",
  },
  critical: {
    control:
      "border-control-border bg-background peer-checked:border-critical peer-checked:bg-critical",
    indicator: "bg-critical-foreground",
  },
} as const;

const sizes = {
  sm: {
    root: "gap-2",
    item: "gap-2 text-sm",
    control: "size-4",
    indicator: "size-1.5",
  },
  md: {
    root: "gap-2.5",
    item: "gap-2.5 text-sm",
    control: "size-5",
    indicator: "size-2",
  },
  lg: {
    root: "gap-3",
    item: "gap-3 text-base",
    control: "size-6",
    indicator: "size-2.5",
  },
} as const;

export interface RadioGroupProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  orientation?: "horizontal" | "vertical";
  size?: keyof typeof sizes;
}

export function RadioGroup({
  className = "",
  orientation = "vertical",
  size = "md",
  ...props
}: RadioGroupProps) {
  return (
    <fieldset
      className={[
        orientation === "horizontal" ? "flex flex-wrap items-center" : "grid",
        sizes[size].root,
        className,
      ].join(" ")}
      data-orientation={orientation}
      data-size={size}
      {...props}
    />
  );
}

export interface RadioItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  description?: ReactNode;
  label: ReactNode;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export function RadioItem({
  className = "",
  description,
  label,
  size = "md",
  variant = "default",
  ...props
}: RadioItemProps) {
  return (
    <label
      className={[
        "group/radio flex cursor-pointer items-start text-foreground has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        sizes[size].item,
        className,
      ].join(" ")}
    >
      <span className={["relative mt-0.5 inline-grid shrink-0 place-items-center", sizes[size].control].join(" ")}>
        <input
          className={[
            "peer absolute inset-0 z-10 cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-not-allowed",
            sizes[size].control,
          ].join(" ")}
          type="radio"
          {...props}
        />
        <span
          aria-hidden="true"
          className={[
            "pointer-events-none grid place-items-center rounded-full border-hairline shadow-[inset_0_1px_0_color-mix(in_oklch,white_70%,transparent),inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_12%,transparent)]",
            "motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
            "peer-hover:shadow-[inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_18%,transparent),0_1px_2px_oklch(0_0_0/0.06)]",
            "peer-active:scale-[0.9] peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-0",
            "peer-checked:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)] peer-checked:[&_[data-indicator]]:opacity-100 peer-checked:[&_[data-indicator]]:motion-safe:scale-100",
            sizes[size].control,
            variants[variant].control,
          ].join(" ")}
        >
          <span
            className={[
              "rounded-full opacity-0 motion-safe:scale-50 motion-safe:transition-[opacity,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
              sizes[size].indicator,
              variants[variant].indicator,
            ].join(" ")}
            data-indicator=""
          />
        </span>
      </span>
      <span className="grid gap-0.5">
        <span className="font-medium tracking-[-0.01em]">{label}</span>
        {description ? (
          <span className="text-sm leading-5 text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
`;

const alertSource = `import type { HTMLAttributes } from "react";

const variants = {
  info: "border-border bg-surface text-foreground",
  primary: "border-primary/25 bg-primary/10 text-foreground",
  critical: "border-critical/25 bg-critical/10 text-foreground",
} as const;

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export function Alert({ className = "", variant = "info", ...props }: AlertProps) {
  return (
    <div
      className={[
        "rounded-[0.375rem] border-hairline p-4 text-sm leading-6",
        "motion-safe:animate-enter motion-reduce:animate-none",
        variants[variant],
        className,
      ].join(" ")}
      role="status"
      {...props}
    />
  );
}

export function AlertTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={["font-semibold tracking-tight", className].join(" ")} {...props} />;
}

export function AlertDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["mt-1 text-muted-foreground", className].join(" ")} {...props} />;
}
`;

const emptyStateSource = `import type { HTMLAttributes, ReactNode } from "react";

const variants = {
  surface: "border-border bg-surface",
  muted: "border-border bg-muted/50",
  ghost: "border-transparent bg-transparent",
} as const;

const sizes = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export function EmptyState({
  className = "",
  size = "md",
  variant = "surface",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={[
        "grid justify-items-center rounded-[0.5rem] border-hairline text-center motion-safe:animate-enter motion-reduce:animate-none",
        sizes[size],
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export interface EmptyStateIconProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function EmptyStateIcon({ className = "", ...props }: EmptyStateIconProps) {
  return (
    <div
      className={[
        "mb-3 grid size-10 place-items-center rounded-full bg-primary/10 text-primary shadow-[inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_20%,transparent)]",
        className,
      ].join(" ")}
      aria-hidden="true"
      {...props}
    />
  );
}

export function EmptyStateTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={["text-base font-semibold tracking-tight", className].join(" ")} {...props} />;
}

export function EmptyStateDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={["mt-2 max-w-sm text-sm leading-6 text-muted-foreground", className].join(" ")}
      {...props}
    />
  );
}

export function EmptyStateActions({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["mt-4 flex flex-wrap justify-center gap-2", className].join(" ")} {...props} />;
}
`;

const separatorSource = `import type { HTMLAttributes } from "react";

const variants = {
  default: "bg-border",
  muted: "bg-muted",
  primary: "bg-primary",
} as const;

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
  variant?: keyof typeof variants;
}

export function Separator({
  className = "",
  decorative = true,
  orientation = "horizontal",
  variant = "default",
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-orientation={decorative ? undefined : orientation}
      className={[
        "shrink-0",
        orientation === "horizontal" ? "h-[0.5px] w-full" : "h-full w-[0.5px]",
        variants[variant],
        className,
      ].join(" ")}
      role={decorative ? "none" : "separator"}
      {...props}
    />
  );
}
`;

const progressSource = `import type { CSSProperties, HTMLAttributes } from "react";

const variants = {
  default: "bg-primary",
  critical: "bg-critical",
} as const;

const sizes = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  indeterminate?: boolean;
  max?: number;
  size?: keyof typeof sizes;
  value?: number;
  variant?: keyof typeof variants;
}

export function Progress({
  className = "",
  indeterminate = false,
  max = 100,
  size = "md",
  style,
  value = 0,
  variant = "default",
  ...props
}: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const percentage = clamp((value / safeMax) * 100, 0, 100);
  const barStyle: CSSProperties = indeterminate
    ? {}
    : { transform: \`scaleX(\${percentage / 100})\` };

  return (
    <div
      aria-valuemax={indeterminate ? undefined : safeMax}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
      className={[
        "relative isolate w-full overflow-hidden rounded-full bg-muted",
        sizes[size],
        className,
      ].join(" ")}
      role="progressbar"
      style={style}
      {...props}
    >
      <div
        className={[
          "h-full rounded-full origin-left will-change-transform",
          "motion-safe:transition-transform motion-safe:duration-[var(--brilliant-duration-normal)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
          indeterminate ? "w-1/3 motion-safe:animate-progress-indeterminate motion-reduce:w-full" : "w-full",
          variants[variant],
        ].join(" ")}
        style={barStyle}
      />
    </div>
  );
}
`;

const skeletonSource = `import type { HTMLAttributes } from "react";

const variants = {
  surface: "bg-muted",
  raised: "bg-secondary",
  primary: "bg-primary/12",
} as const;

const sizes = {
  text: "h-4 w-full rounded-[0.25rem]",
  title: "h-6 w-2/3 rounded-[0.25rem]",
  avatar: "size-10 rounded-full",
  thumbnail: "aspect-video w-full rounded-[0.375rem]",
  card: "h-28 w-full rounded-[0.5rem]",
} as const;

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export function Skeleton({
  className = "",
  shimmer = true,
  size = "text",
  variant = "surface",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={[
        "relative isolate overflow-hidden",
        sizes[size],
        variants[variant],
        shimmer
          ? "after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden"
          : "motion-safe:animate-pulse motion-reduce:animate-none",
        className,
      ].join(" ")}
      aria-hidden="true"
      {...props}
    />
  );
}
`;

const spinnerSource = `import type { HTMLAttributes } from "react";

const variants = {
  default: "text-primary",
  muted: "text-muted-foreground",
  critical: "text-critical",
} as const;

const sizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export function Spinner({
  className = "",
  label = "Loading",
  size = "md",
  variant = "default",
  ...props
}: SpinnerProps) {
  return (
    <span
      className={["inline-flex items-center justify-center", variants[variant], className].join(" ")}
      role="status"
      {...props}
    >
      <svg
        aria-hidden="true"
        className={[
          "motion-safe:animate-spinner motion-reduce:animate-none",
          sizes[size],
        ].join(" ")}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
`;

const fieldSource = `import type { HTMLAttributes } from "react";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {}

export function Field({ className = "", ...props }: FieldProps) {
  return <div className={["grid gap-2", className].join(" ")} {...props} />;
}

export function FieldLabel({ className = "", ...props }: HTMLAttributes<HTMLLabelElement>) {
  return <label className={["text-sm font-medium leading-none", className].join(" ")} {...props} />;
}

export function FieldDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["text-sm leading-5 text-muted-foreground", className].join(" ")} {...props} />;
}

export function FieldError({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["text-sm leading-5 text-critical motion-safe:animate-enter motion-reduce:animate-none", className].join(" ")} role="alert" {...props} />;
}

export function FieldGroup({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["grid gap-4", className].join(" ")} {...props} />;
}
`;

const sliderSource = `import type { InputHTMLAttributes } from "react";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export function Slider({ className = "", ...props }: SliderProps) {
  return (
    <input
      className={[
        "h-5 w-full cursor-pointer appearance-none bg-transparent accent-primary disabled:cursor-not-allowed disabled:opacity-50",
        "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted",
        "[&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-hairline [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm",
        "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted",
        "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-hairline [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm",
        "motion-safe:transition-opacity motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      ].join(" ")}
      type="range"
      {...props}
    />
  );
}
`;

const selectSource = `"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import type { ComponentPropsWithoutRef } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cx(
        "flex h-9 w-full items-center justify-between gap-2 rounded-[0.25rem] border-0 bg-background px-3 text-sm text-foreground shadow-[inset_0_0_0_1px_var(--brilliant-control-border)]",
        "data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        "motion-safe:transition-[background-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "hover:bg-muted/50 focus:outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] data-[state=open]:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)]",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <svg aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 16 16">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className = "",
  position = "popper",
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cx(
          "z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-[0.375rem] border-hairline border-border bg-surface text-foreground shadow-md",
          "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          "motion-safe:data-[state=open]:animate-enter motion-safe:data-[state=closed]:animate-exit motion-reduce:animate-none",
          position === "popper" && "w-[var(--radix-select-trigger-width)]",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{props.children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cx("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SelectItem({
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cx(
        "relative flex cursor-default select-none items-center rounded-[0.25rem] py-1.5 pr-8 pl-8 text-sm outline-none",
        "data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "motion-safe:transition-colors motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <svg aria-hidden="true" className="size-4 text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" viewBox="0 0 16 16">
            <path d="M3.5 8.25 6.5 11l6-6" />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cx("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}
`;

const comboboxSource = `"use client";

import { useId, useMemo, useState } from "react";
import type { InputHTMLAttributes, KeyboardEvent } from "react";

export interface ComboboxOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface ComboboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "list" | "onChange" | "value"> {
  defaultValue?: string;
  emptyMessage?: string;
  onValueChange?: (value: string) => void;
  options: readonly ComboboxOption[];
  value?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Combobox({
  className = "",
  defaultValue = "",
  emptyMessage = "No results found.",
  id,
  onBlur,
  onFocus,
  onKeyDown,
  onValueChange,
  options,
  placeholder = "Search...",
  value,
  ...props
}: ComboboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = \`\${inputId}-listbox\`;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputValue = value ?? internalValue;

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      \`\${option.label} \${option.value}\`.toLowerCase().includes(query),
    );
  }, [inputValue, options]);

  const selectableOptions = filteredOptions.filter((option) => !option.disabled);
  const activeOption = selectableOptions[Math.min(highlightedIndex, selectableOptions.length - 1)];

  function updateValue(nextValue: string) {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  function commitOption(option: ComboboxOption) {
    if (option.disabled) return;
    updateValue(option.value);
    setOpen(false);
    setHighlightedIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((current) =>
        selectableOptions.length ? Math.min(current + 1, selectableOptions.length - 1) : 0,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" && open && activeOption) {
      event.preventDefault();
      commitOption(activeOption);
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        aria-activedescendant={open && activeOption ? \`\${listboxId}-\${activeOption.value}\` : undefined}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={open}
        className={cx(
          "h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 pr-9 text-sm text-foreground shadow-[inset_0_0_0_1px_var(--brilliant-control-border)]",
          "placeholder:text-muted-foreground motion-safe:transition-[background-color,box-shadow] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
          "focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:outline-none",
          className,
        )}
        id={inputId}
        onBlur={(event) => {
          onBlur?.(event);
          window.setTimeout(() => setOpen(false), 120);
        }}
        onChange={(event) => {
          updateValue(event.currentTarget.value);
          setOpen(true);
          setHighlightedIndex(0);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        value={inputValue}
        {...props}
      />
      <svg aria-hidden="true" className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 size-4 text-muted-foreground" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 16 16">
        <path d="m4 6 4 4 4-4" />
      </svg>
      {open ? (
        <div
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-[0.375rem] border-hairline border-border bg-surface p-1 text-sm shadow-md motion-safe:animate-enter motion-reduce:animate-none"
          id={listboxId}
          role="listbox"
        >
          {filteredOptions.length ? (
            filteredOptions.map((option) => {
              const selected = option.value === inputValue;
              const highlighted = activeOption?.value === option.value;
              return (
                <button
                  aria-selected={selected}
                  className={cx(
                    "relative flex w-full items-center rounded-[0.25rem] py-1.5 pr-3 pl-8 text-left outline-none",
                    "motion-safe:transition-colors motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
                    highlighted && "bg-muted text-foreground",
                    option.disabled && "pointer-events-none opacity-50",
                  )}
                  disabled={option.disabled}
                  id={\`\${listboxId}-\${option.value}\`}
                  key={option.value}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => {
                    const nextIndex = selectableOptions.findIndex((item) => item.value === option.value);
                    if (nextIndex >= 0) setHighlightedIndex(nextIndex);
                  }}
                  onClick={() => commitOption(option)}
                  role="option"
                  type="button"
                >
                  <span className="absolute left-2 grid size-4 place-items-center text-primary">
                    {selected ? (
                      <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" viewBox="0 0 16 16">
                        <path d="M3.5 8.25 6.5 11l6-6" />
                      </svg>
                    ) : null}
                  </span>
                  {option.label}
                </button>
              );
            })
          ) : (
            <div className="px-2 py-2 text-sm text-muted-foreground">{emptyMessage}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
`;

const dialogSource = `import type { DialogHTMLAttributes, HTMLAttributes } from "react";

export interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {}

export function Dialog({ className = "", ...props }: DialogProps) {
  return (
    <dialog
      className={[
        "m-auto w-[min(32rem,calc(100vw-2rem))] rounded-[0.5rem] border-hairline border-border bg-surface p-0 text-foreground shadow-md backdrop:bg-foreground/30 open:motion-safe:animate-enter open:motion-reduce:animate-none",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function DialogHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["border-b border-border p-4", className].join(" ")} {...props} />;
}

export function DialogTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={["text-lg font-semibold tracking-tight", className].join(" ")} {...props} />;
}

export function DialogDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["mt-1 text-sm leading-6 text-muted-foreground", className].join(" ")} {...props} />;
}

export function DialogContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4", className].join(" ")} {...props} />;
}

export function DialogFooter({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["flex justify-end gap-2 border-t border-border p-4", className].join(" ")} {...props} />;
}
`;

const alertDialogSource = `import type { DialogHTMLAttributes, HTMLAttributes } from "react";

export interface AlertDialogProps extends DialogHTMLAttributes<HTMLDialogElement> {}

export function AlertDialog({ className = "", ...props }: AlertDialogProps) {
  return (
    <dialog
      className={[
        "m-auto w-[min(30rem,calc(100vw-2rem))] rounded-[0.5rem] border-hairline border-critical/25 bg-surface p-0 text-foreground shadow-md backdrop:bg-foreground/30 open:motion-safe:animate-enter open:motion-reduce:animate-none",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function AlertDialogHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["border-b border-border p-4", className].join(" ")} {...props} />;
}

export function AlertDialogTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={["text-lg font-semibold tracking-tight", className].join(" ")} {...props} />;
}

export function AlertDialogDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["mt-1 text-sm leading-6 text-muted-foreground", className].join(" ")} {...props} />;
}

export function AlertDialogContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4", className].join(" ")} {...props} />;
}

export function AlertDialogFooter({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["flex justify-end gap-2 border-t border-border p-4", className].join(" ")} {...props} />;
}
`;

const sheetSource = `import type { DialogHTMLAttributes, HTMLAttributes } from "react";

const sides = {
  right: "ml-auto mr-0 h-dvh max-h-none w-[min(28rem,100vw)]",
  left: "mr-auto ml-0 h-dvh max-h-none w-[min(28rem,100vw)]",
  top: "mt-0 mb-auto w-full max-w-none",
  bottom: "mt-auto mb-0 w-full max-w-none",
} as const;

const sideMotion = {
  right: "open:motion-safe:animate-slide-in-from-right",
  left: "open:motion-safe:animate-slide-in-from-left",
  top: "open:motion-safe:animate-slide-in-from-top",
  bottom: "open:motion-safe:animate-slide-in-from-bottom",
} as const;

export interface SheetProps extends DialogHTMLAttributes<HTMLDialogElement> {
  side?: keyof typeof sides;
}

export function Sheet({ className = "", side = "right", ...props }: SheetProps) {
  return (
    <dialog
      className={[
        "border-hairline border-border bg-surface p-0 text-foreground shadow-md backdrop:bg-foreground/30 open:motion-reduce:animate-none",
        sides[side],
        sideMotion[side],
        className,
      ].join(" ")}
      data-side={side}
      {...props}
    />
  );
}

export function SheetHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["border-b border-border p-4", className].join(" ")} {...props} />;
}

export function SheetTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={["text-lg font-semibold tracking-tight", className].join(" ")} {...props} />;
}

export function SheetDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["mt-1 text-sm leading-6 text-muted-foreground", className].join(" ")} {...props} />;
}

export function SheetContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4", className].join(" ")} {...props} />;
}
`;

const drawerSource = sheetSource
  .replaceAll("Sheet", "Drawer")
  .replaceAll("sheet", "drawer")
  .replace('side = "right"', 'side = "bottom"');

const dropdownMenuSource = `"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

export function DropdownMenuContent({
  className = "",
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cx(
          "z-50 min-w-48 overflow-hidden rounded-[0.375rem] border-hairline border-border bg-surface p-1 text-sm text-foreground shadow-md",
          "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          "motion-safe:data-[state=open]:animate-enter motion-reduce:animate-none",
          className,
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cx(
        "relative flex cursor-default select-none items-center rounded-[0.25rem] px-2 py-1.5 outline-none",
        "data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "motion-safe:transition-colors motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  checked,
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cx(
        "relative flex cursor-default select-none items-center rounded-[0.25rem] py-1.5 pr-2 pl-8 outline-none",
        "data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 grid size-4 place-items-center text-primary">
        <DropdownMenuPrimitive.ItemIndicator>
          <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" viewBox="0 0 16 16">
            <path d="M3.5 8.25 6.5 11l6-6" />
          </svg>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioGroup({
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
}

export function DropdownMenuRadioItem({
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cx(
        "relative flex cursor-default select-none items-center rounded-[0.25rem] py-1.5 pr-2 pl-8 outline-none",
        "data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 grid size-4 place-items-center text-primary">
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="size-2 rounded-full bg-primary" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>) {
  return <DropdownMenuPrimitive.Label className={cx("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)} {...props} />;
}

export function DropdownMenuSeparator({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={cx("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}
`;

const tooltipSource = `import type { HTMLAttributes, ReactNode } from "react";

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  content: ReactNode;
}

export function Tooltip({ children, className = "", content, ...props }: TooltipProps) {
  return (
    <span className={["group/tooltip relative inline-flex", className].join(" ")} {...props}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[0.25rem] bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-sm motion-safe:transition-[opacity,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none group-hover/tooltip:-translate-y-0.5 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100">
        {content}
      </span>
    </span>
  );
}
`;

const popoverSource = `import type { DetailsHTMLAttributes, HTMLAttributes } from "react";

export interface PopoverProps extends DetailsHTMLAttributes<HTMLDetailsElement> {}

export function Popover({ className = "", ...props }: PopoverProps) {
  return <details className={["relative inline-block", className].join(" ")} {...props} />;
}

export function PopoverTrigger({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <summary className={["list-none cursor-pointer", className].join(" ")} {...props} />;
}

export function PopoverContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["absolute z-50 mt-2 min-w-56 rounded-[0.5rem] border-hairline border-border bg-surface p-3 text-sm shadow-md motion-safe:animate-enter motion-reduce:animate-none", className].join(" ")} {...props} />;
}
`;

const hoverCardSource = popoverSource
  .replaceAll("Popover", "HoverCard")
  .replaceAll("popover", "hover-card");

const contextMenuSource = `import { useState } from "react";
import type { HTMLAttributes } from "react";

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {}

export function ContextMenu({ children, className = "", ...props }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={["relative", className].join(" ")}
      onContextMenu={(event) => {
        event.preventDefault();
        setOpen(true);
      }}
      {...props}
    >
      {children}
      {open ? (
        <div className="absolute z-50 mt-2 min-w-44 rounded-[0.5rem] border-hairline border-border bg-surface p-1 text-sm shadow-md motion-safe:animate-enter motion-reduce:animate-none" role="menu">
          <button className="block w-full rounded-[0.25rem] px-2 py-1.5 text-left hover:bg-muted" onClick={() => setOpen(false)} type="button">Open</button>
          <button className="block w-full rounded-[0.25rem] px-2 py-1.5 text-left hover:bg-muted" onClick={() => setOpen(false)} type="button">Rename</button>
        </div>
      ) : null}
    </div>
  );
}
`;

const tabsSource = `"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentPropsWithoutRef } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cx("inline-flex w-fit rounded-[0.375rem] bg-muted p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cx(
        "rounded-[0.25rem] px-3 py-1.5 text-sm font-medium text-muted-foreground outline-none",
        "data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        "hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring",
        "motion-safe:transition-[background-color,color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "active:scale-[0.98]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cx(
        "rounded-[0.5rem] border-hairline border-border bg-surface p-4 text-sm outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring motion-safe:data-[state=active]:animate-enter motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
`;

const accordionSource = `import type { DetailsHTMLAttributes, HTMLAttributes } from "react";

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {}

export function Accordion({ className = "", ...props }: AccordionProps) {
  return <div className={["divide-y divide-border rounded-[0.5rem] border-hairline border-border", className].join(" ")} {...props} />;
}

export function AccordionItem({ className = "", ...props }: DetailsHTMLAttributes<HTMLDetailsElement>) {
  return <details className={["group", className].join(" ")} {...props} />;
}

export function AccordionTrigger({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <summary className={["cursor-pointer list-none px-4 py-3 text-sm font-medium hover:bg-muted", className].join(" ")} {...props} />;
}

export function AccordionContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["px-4 pb-4 text-sm leading-6 text-muted-foreground motion-safe:animate-enter motion-reduce:animate-none", className].join(" ")} {...props} />;
}
`;

const collapsibleSource = accordionSource
  .replaceAll("Accordion", "Collapsible")
  .replaceAll("accordion", "collapsible");

const carouselSource = `"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

interface CarouselContextValue {
  count: number;
  index: number;
  next: () => void;
  previous: () => void;
  setIndex: (index: number) => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("Carousel parts must be rendered inside <Carousel>.");
  return context;
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  defaultIndex?: number;
  itemCount: number;
}

export function Carousel({
  children,
  className = "",
  defaultIndex = 0,
  itemCount,
  ...props
}: CarouselProps) {
  const [index, setIndexState] = useState(defaultIndex);
  const count = Math.max(itemCount, 1);

  const value = useMemo<CarouselContextValue>(() => {
    const clamp = (nextIndex: number) => Math.min(Math.max(nextIndex, 0), count - 1);
    return {
      count,
      index,
      next: () => setIndexState((current) => clamp(current + 1)),
      previous: () => setIndexState((current) => clamp(current - 1)),
      setIndex: (nextIndex) => setIndexState(clamp(nextIndex)),
    };
  }, [count, index]);

  return (
    <CarouselContext.Provider value={value}>
      <div className={cx("relative grid gap-3", className)} data-index={index} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselViewport({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("overflow-hidden rounded-[0.5rem] border-hairline border-border bg-surface", className)}
      {...props}
    />
  );
}

export function CarouselTrack({ className = "", style, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { index } = useCarousel();
  return (
    <div
      className={cx(
        "flex motion-safe:transition-transform motion-safe:duration-[var(--brilliant-duration-normal)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
        className,
      )}
      style={{ transform: \`translate3d(-\${index * 100}%, 0, 0)\`, ...style }}
      {...props}
    />
  );
}

export function CarouselItem({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("min-w-0 shrink-0 grow-0 basis-full p-4", className)} {...props} />;
}

export function CarouselPrevious({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { index, previous } = useCarousel();
  return (
    <button
      aria-label="Previous slide"
      className={cx(
        "inline-flex size-8 items-center justify-center rounded-[0.25rem] border-hairline border-border bg-surface text-sm shadow-sm",
        "motion-safe:transition-[background-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "hover:-translate-y-px hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      disabled={index === 0}
      onClick={previous}
      type={type}
      {...props}
    >
      <span aria-hidden="true">‹</span>
    </button>
  );
}

export function CarouselNext({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { count, index, next } = useCarousel();
  return (
    <button
      aria-label="Next slide"
      className={cx(
        "inline-flex size-8 items-center justify-center rounded-[0.25rem] border-hairline border-border bg-surface text-sm shadow-sm",
        "motion-safe:transition-[background-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "hover:-translate-y-px hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      disabled={index === count - 1}
      onClick={next}
      type={type}
      {...props}
    >
      <span aria-hidden="true">›</span>
    </button>
  );
}

export function CarouselDots({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  const { count, index, setIndex } = useCarousel();
  return (
    <div className={cx("flex items-center justify-center gap-1.5", className)} {...props}>
      {Array.from({ length: count }).map((_, dotIndex) => (
        <button
          aria-label={\`Go to slide \${dotIndex + 1}\`}
          aria-current={index === dotIndex ? "true" : undefined}
          className="size-1.5 rounded-full bg-muted-foreground/35 transition-[background-color,transform] aria-current:scale-125 aria-current:bg-primary"
          key={dotIndex}
          onClick={() => setIndex(dotIndex)}
          type="button"
        />
      ))}
    </div>
  );
}
`;

const breadcrumbSource = `import type { HTMLAttributes } from "react";

export function Breadcrumb({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <nav aria-label="Breadcrumb" className={className} {...props} />;
}

export function BreadcrumbList({ className = "", ...props }: HTMLAttributes<HTMLOListElement>) {
  return <ol className={["flex flex-wrap items-center gap-1 text-sm text-muted-foreground", className].join(" ")} {...props} />;
}

export function BreadcrumbItem({ className = "", ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li className={["inline-flex items-center gap-1", className].join(" ")} {...props} />;
}

export function BreadcrumbSeparator({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span aria-hidden="true" className={["text-muted-foreground/70", className].join(" ")} {...props}>/</span>;
}
`;

const navigationMenuSource = `import type { HTMLAttributes } from "react";

export function NavigationMenu({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <nav className={["flex items-center gap-1", className].join(" ")} {...props} />;
}

export function NavigationMenuLink({ className = "", ...props }: HTMLAttributes<HTMLAnchorElement>) {
  return <a className={["rounded-[0.25rem] px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground", className].join(" ")} {...props} />;
}
`;

const menubarSource = `import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function Menubar({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["flex items-center gap-1 rounded-[0.375rem] border-hairline border-border bg-surface p-1", className].join(" ")} role="menubar" {...props} />;
}

export function MenubarItem({ className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={["rounded-[0.25rem] px-3 py-1.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", className].join(" ")} role="menuitem" type={type} {...props} />;
}
`;

const paginationSource = `import type { HTMLAttributes } from "react";

export function Pagination({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <nav aria-label="Pagination" className={className} {...props} />;
}

export function PaginationList({ className = "", ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={["flex items-center gap-1", className].join(" ")} {...props} />;
}

export function PaginationItem({ className = "", ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li className={className} {...props} />;
}

export function PaginationLink({ className = "", ...props }: HTMLAttributes<HTMLAnchorElement>) {
  return <a className={["inline-flex size-9 items-center justify-center rounded-[0.25rem] text-sm hover:bg-muted aria-current:bg-primary aria-current:text-primary-foreground", className].join(" ")} {...props} />;
}
`;

const tableSource = `import type { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Table({ className = "", ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cx("w-full caption-bottom border-collapse text-sm", className)} {...props} />;
}

export function TableHeader({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cx("border-b border-border bg-muted/60", className)} {...props} />;
}

export function TableBody({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cx("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cx("border-t border-border bg-muted/60 font-medium", className)} {...props} />;
}

export function TableRow({ className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cx("border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-primary/10", className)} {...props} />;
}

export function TableHead({ className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cx("h-10 px-3 text-left align-middle text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground", className)} {...props} />;
}

export function TableCell({ className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cx("px-3 py-3 align-middle", className)} {...props} />;
}

export function TableCaption({ className = "", ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cx("mt-3 text-sm text-muted-foreground", className)} {...props} />;
}
`;

const formSource = `import type { FormHTMLAttributes, HTMLAttributes } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Form({ className = "", ...props }: FormHTMLAttributes<HTMLFormElement>) {
  return <form className={cx("grid gap-4", className)} {...props} />;
}

export function FormSection({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cx("grid gap-4 rounded-[0.5rem] border-hairline border-border bg-surface p-4", className)} {...props} />;
}

export function FormHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("grid gap-1", className)} {...props} />;
}

export function FormTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx("text-base font-semibold tracking-tight", className)} {...props} />;
}

export function FormDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("text-sm leading-6 text-muted-foreground", className)} {...props} />;
}

export function FormActions({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("flex items-center justify-end gap-2 border-t border-border pt-4", className)} {...props} />;
}
`;

const scrollAreaSource = `"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import type { ComponentPropsWithoutRef } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ScrollArea({
  className = "",
  children,
  ...props
}: ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root className={cx("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

export function ScrollBar({
  className = "",
  orientation = "vertical",
  ...props
}: ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      className={cx(
        "flex touch-none select-none p-0.5 transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-muted-foreground/35 hover:bg-muted-foreground/55" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}
`;

const toastSource = `"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export interface ToastMessage {
  description?: ReactNode;
  id: string;
  title: ReactNode;
  variant?: "default" | "critical" | "primary";
}

interface ToastContextValue {
  dismiss: (id: string) => void;
  toast: (message: Omit<ToastMessage, "id"> & { id?: string }) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  const toast = useCallback((message: Omit<ToastMessage, "id"> & { id?: string }) => {
    const id = message.id ?? crypto.randomUUID();
    setMessages((current) => [{ ...message, id }, ...current].slice(0, 4));
    return id;
  }, []);

  const value = useMemo(() => ({ dismiss, toast }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion>
        {messages.map((message) => (
          <Toast key={message.id} variant={message.variant}>
            <div className="min-w-0">
              <ToastTitle>{message.title}</ToastTitle>
              {message.description ? <ToastDescription>{message.description}</ToastDescription> : null}
            </div>
            <ToastClose onClick={() => dismiss(message.id)} />
          </Toast>
        ))}
      </ToastRegion>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}

export function ToastRegion({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-live="polite" className={cx("fixed right-4 bottom-4 z-50 grid w-[min(22rem,calc(100vw-2rem))] gap-2", className)} role="region" {...props} />;
}

export function Toast({
  className = "",
  variant = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: ToastMessage["variant"] }) {
  return (
    <div
      className={cx(
        "flex items-start justify-between gap-3 rounded-[0.5rem] border-hairline bg-surface p-4 text-sm shadow-md motion-safe:animate-enter motion-reduce:animate-none",
        variant === "default" && "border-border",
        variant === "primary" && "border-primary/25 bg-primary/10",
        variant === "critical" && "border-critical/30 bg-critical/10",
        className,
      )}
      role="status"
      {...props}
    />
  );
}

export function ToastTitle({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("font-semibold tracking-tight", className)} {...props} />;
}

export function ToastDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("mt-1 text-sm leading-5 text-muted-foreground", className)} {...props} />;
}

export function ToastClose({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button aria-label="Dismiss toast" className={cx("grid size-7 shrink-0 place-items-center rounded-[0.25rem] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", className)} type={type} {...props}>×</button>;
}
`;

const calendarSource = `import type { TableHTMLAttributes } from "react";

export interface CalendarProps extends TableHTMLAttributes<HTMLTableElement> {}

export function Calendar({ className = "", ...props }: CalendarProps) {
  return <table className={["w-full border-collapse text-center text-sm", className].join(" ")} {...props} />;
}
`;

const dateInputSource = `import type { InputHTMLAttributes } from "react";

export interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export function DateInput({ className = "", ...props }: DateInputProps) {
  return <input className={["h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:outline-none", className].join(" ")} type="date" {...props} />;
}
`;

const commandSource = `import type { HTMLAttributes, InputHTMLAttributes } from "react";

export function Command({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["overflow-hidden rounded-[0.5rem] border-hairline border-border bg-surface shadow-sm", className].join(" ")} {...props} />;
}

export function CommandInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={["h-10 w-full border-b border-border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground", className].join(" ")} {...props} />;
}

export function CommandList({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["max-h-72 overflow-auto p-1", className].join(" ")} role="listbox" {...props} />;
}

export function CommandItem({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["rounded-[0.25rem] px-2 py-1.5 text-sm hover:bg-muted", className].join(" ")} role="option" {...props} />;
}
`;

const headerSource = `"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

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
        menuOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-1 opacity-0",
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
          <span className={cx("block h-px w-4 bg-current transition-transform", menuOpen && "translate-y-[2.5px] rotate-45")} />
          <span className={cx("block h-px w-4 bg-current transition-transform", menuOpen && "-translate-y-[2.5px] -rotate-45")} />
        </span>
      )}
    </button>
  );
}
`;

const footerSource = `import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

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

export function FooterDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
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
`;

const applicationShellSource = `"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

interface ApplicationShellContextValue {
  closeMobileNav: () => void;
  mobileNavOpen: boolean;
  openMobileNav: () => void;
}

const ApplicationShellContext = createContext<ApplicationShellContextValue | null>(null);

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useApplicationShell() {
  const context = useContext(ApplicationShellContext);
  if (!context) {
    throw new Error("Application Shell parts must be rendered inside <ApplicationShell>.");
  }
  return context;
}

export interface ApplicationShellProps extends HTMLAttributes<HTMLDivElement> {
  defaultMobileNavOpen?: boolean;
}

export function ApplicationShell({
  children,
  className = "",
  defaultMobileNavOpen = false,
  ...props
}: ApplicationShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(defaultMobileNavOpen);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  const value = useMemo<ApplicationShellContextValue>(
    () => ({
      closeMobileNav: () => setMobileNavOpen(false),
      mobileNavOpen,
      openMobileNav: () => setMobileNavOpen(true),
    }),
    [mobileNavOpen],
  );

  return (
    <ApplicationShellContext.Provider value={value}>
      <div
        className={cx(
          "min-h-screen bg-background text-foreground md:grid md:grid-cols-[17.5rem_minmax(0,1fr)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ApplicationShellContext.Provider>
  );
}

export function ApplicationShellHeader({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cx(
        "sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/82 md:px-6",
        className,
      )}
      {...props}
    />
  );
}

export function ApplicationShellMobileTrigger({
  children = "☰",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openMobileNav } = useApplicationShell();

  return (
    <button
      aria-label="Open navigation"
      className={cx(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-[0.25rem] border-hairline border-border bg-surface text-sm text-foreground shadow-sm",
        "motion-safe:transition-[background-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.98] md:hidden",
        className,
      )}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) openMobileNav();
      }}
      type={type}
    >
      {children}
    </button>
  );
}

export function ApplicationShellSidebar({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  const { closeMobileNav, mobileNavOpen } = useApplicationShell();

  return (
    <>
      <button
        aria-hidden={!mobileNavOpen}
        className={cx(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] transition-opacity md:hidden",
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMobileNav}
        tabIndex={mobileNavOpen ? 0 : -1}
        type="button"
      />
      <aside
        aria-label="Application navigation"
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-[min(17.5rem,calc(100vw-2rem))] flex-col overflow-y-auto border-r border-border bg-background px-4 py-4 shadow-[12px_0_40px_-28px_oklch(0_0_0/0.45)] md:sticky md:top-0 md:z-auto md:h-screen md:w-auto md:translate-x-0 md:shadow-none",
          "motion-safe:transition-transform motion-safe:duration-[var(--brilliant-duration-normal)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        {...props}
      />
    </>
  );
}

export function ApplicationShellBrand({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cx(
        "mb-5 flex items-center gap-3 rounded-[0.375rem] text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

export function ApplicationShellSearch({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cx(
        "mb-5 flex h-9 items-center gap-2 rounded-[0.375rem] border-hairline border-border bg-surface px-3 text-sm text-muted-foreground shadow-sm",
        "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

export function ApplicationShellNav({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <nav className={cx("grid gap-4 text-sm", className)} {...props} />;
}

export function ApplicationShellNavSection({
  children,
  className = "",
  title,
  ...props
}: HTMLAttributes<HTMLDivElement> & { title: string }) {
  return (
    <section className={cx("grid gap-1", className)} {...props}>
      <h2 className="px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h2>
      <div className="grid gap-0.5">{children}</div>
    </section>
  );
}

export function ApplicationShellNavItem({
  active = false,
  children,
  className = "",
  icon,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  icon?: ReactNode;
}) {
  const { closeMobileNav } = useApplicationShell();

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cx(
        "group flex items-center gap-2 rounded-[0.375rem] px-2 py-1.5 leading-5 transition-colors",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) closeMobileNav();
      }}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={cx(
            "grid size-5 shrink-0 place-items-center rounded-[0.3125rem] border-hairline transition-colors",
            active
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 truncate">{children}</span>
    </a>
  );
}

export function ApplicationShellNavMedia({
  active = false,
  children,
  className = "",
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  active?: boolean;
  tone?: "default" | "primary" | "success" | "warning" | "critical";
}) {
  const tones = {
    default: active
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-border bg-background text-muted-foreground",
    primary: "border-primary/20 bg-primary/10 text-primary",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    critical: "border-critical/25 bg-critical/10 text-critical",
  } as const;

  return (
    <span
      className={cx(
        "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border-hairline text-sm font-medium shadow-sm",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function ApplicationShellNavGroupItem({
  active = false,
  children,
  className = "",
  description,
  media,
  onClick,
  trailing,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  description?: ReactNode;
  media?: ReactNode;
  trailing?: ReactNode;
}) {
  const { closeMobileNav } = useApplicationShell();

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cx(
        "group flex items-center gap-3 rounded-[0.5rem] px-2 py-2 transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) closeMobileNav();
      }}
    >
      {media}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{children}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-sm leading-5 text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {trailing ? <span className="shrink-0 text-muted-foreground">{trailing}</span> : null}
    </a>
  );
}

export function ApplicationShellMenu({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-[0.75rem] border-hairline border-border bg-surface py-1 shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export function ApplicationShellMenuSection({
  className = "",
  title,
  ...props
}: HTMLAttributes<HTMLDivElement> & { title?: string }) {
  return (
    <section
      className={cx(
        "border-b border-border py-1 last:border-b-0",
        title ? "pt-2" : "",
        className,
      )}
      {...props}
    >
      {title ? (
        <h3 className="px-4 pb-1 text-xs font-medium text-muted-foreground">{title}</h3>
      ) : null}
      {props.children}
    </section>
  );
}

export function ApplicationShellMenuItem({
  active = false,
  children,
  className = "",
  icon,
  media,
  trailing,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  icon?: ReactNode;
  media?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <button
      className={cx(
        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors",
        active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
        className,
      )}
      type={type}
      {...props}
    >
      {media ? <span className="shrink-0">{media}</span> : null}
      {icon ? <span className="grid size-5 shrink-0 place-items-center text-muted-foreground">{icon}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing ? <span className="shrink-0 text-muted-foreground">{trailing}</span> : null}
    </button>
  );
}

export function ApplicationShellAccountSwitcher({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "mt-auto border-t border-border pt-3",
        className,
      )}
      {...props}
    />
  );
}

export function ApplicationShellAccountItem({
  active = false,
  children,
  className = "",
  description,
  media,
  trailing,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  description?: ReactNode;
  media?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <button
      className={cx(
        "flex w-full items-center gap-3 rounded-[0.5rem] px-2 py-2 text-left transition-colors",
        active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      type="button"
      {...props}
    >
      {media}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{children}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-xs leading-5 text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {trailing ? <span className="shrink-0 text-muted-foreground">{trailing}</span> : null}
    </button>
  );
}

export function ApplicationShellMain({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <main className={cx("min-w-0 px-4 py-6 md:px-8 lg:px-10", className)} {...props} />;
}

export function ApplicationShellFooter({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={cx(
        "mt-auto border-t border-border pt-4 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
`;

const onboardingWizardSource = `import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const stepStates = {
  complete: "border-primary/30 bg-primary/10 text-primary",
  current: "border-primary bg-primary text-primary-foreground shadow-sm",
  upcoming: "border-border bg-background text-muted-foreground",
} as const;

export interface OnboardingWizardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "panel" | "split" | "compact";
}

export function OnboardingWizard({
  className = "",
  variant = "panel",
  ...props
}: OnboardingWizardProps) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-[0.75rem] border-hairline border-border bg-surface shadow-sm",
        "motion-safe:animate-enter motion-reduce:animate-none",
        variant === "split" && "grid md:grid-cols-[18rem_minmax(0,1fr)]",
        variant === "compact" && "max-w-2xl",
        className,
      )}
      {...props}
    />
  );
}

export function OnboardingWizardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("border-b border-border bg-background/70 px-5 py-4", className)}
      {...props}
    />
  );
}

export function OnboardingWizardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cx("text-lg font-semibold tracking-tight", className)} {...props} />;
}

export function OnboardingWizardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("mt-1 text-sm leading-6 text-muted-foreground", className)} {...props} />;
}

export function OnboardingWizardProgress({
  className = "",
  label = "Onboarding progress",
  value,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label?: string;
  value: number;
}) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cx("mt-4 grid gap-2", className)} {...props}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{clampedValue}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="presentation">
        <div
          className="h-full origin-left rounded-full bg-primary transition-transform duration-[var(--brilliant-duration-normal)] ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none"
          style={{ transform: "scaleX(var(--wizard-progress))", "--wizard-progress": clampedValue / 100 } as CSSProperties}
        />
      </div>
    </div>
  );
}

export function OnboardingWizardStepList({
  className = "",
  ...props
}: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cx("grid gap-2 border-b border-border p-4 md:border-r md:border-b-0", className)}
      {...props}
    />
  );
}

export function OnboardingWizardStep({
  children,
  className = "",
  description,
  index,
  state = "upcoming",
  title,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  description?: ReactNode;
  index: number;
  state?: keyof typeof stepStates;
  title: ReactNode;
}) {
  return (
    <li className="list-none">
      <button
        aria-current={state === "current" ? "step" : undefined}
        className={cx(
          "group flex w-full items-start gap-3 rounded-[0.5rem] px-3 py-2.5 text-left transition-[background-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)]",
          "hover:bg-muted active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          state === "current" && "bg-muted shadow-[inset_0_0_0_0.5px_var(--brilliant-control-border)]",
          className,
        )}
        type={type}
        {...props}
      >
        <span
          className={cx(
            "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-hairline text-xs font-semibold transition-colors",
            stepStates[state],
          )}
        >
          {state === "complete" ? "✓" : index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">{title}</span>
          {description ? (
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {description}
            </span>
          ) : null}
          {children}
        </span>
      </button>
    </li>
  );
}

export function OnboardingWizardPanel({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cx("grid min-h-80 content-between gap-6 p-5", className)} {...props} />;
}

export function OnboardingWizardMeta({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "inline-flex w-fit items-center rounded-[0.375rem] bg-primary/10 px-2 py-1 text-xs font-medium text-primary",
        className,
      )}
      {...props}
    />
  );
}

export function OnboardingWizardContent({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("grid gap-4", className)} {...props} />;
}

export function OnboardingWizardActions({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4",
        className,
      )}
      {...props}
    />
  );
}
`;

export const registry = [
  {
    name: "button",
    title: "Button",
    description: "An accessible action control with semantic visual hierarchy.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "button.tsx", content: buttonSource, target: "ui/button.tsx" }],
    metadata: {
      purpose: "Triggers an immediate action or submits a form.",
      slots: ["root", "icon", "label"],
      accessibility: [
        "Uses a native button element.",
        "Icon-only buttons require an aria-label.",
        "Focus is always visible for keyboard users.",
        "Motion is guarded by motion-safe and motion-reduce variants.",
      ],
      usage: [
        "Use a single primary action per region.",
        "Prefer verbs for labels.",
        "Micro interactions are included in the generated source.",
      ],
      avoid: ["Do not use for navigation; use a link.", "Do not disable without explaining why."],
    },
  },
  {
    name: "button-group",
    title: "Button Group",
    description: "A grouped action wrapper for related Brilliant buttons.",
    kind: "component",
    dependencies: [],
    registryDependencies: ["button"],
    files: [
      { path: "button-group.tsx", content: buttonGroupSource, target: "ui/button-group.tsx" },
    ],
    metadata: {
      purpose: "Groups related actions into one compact control cluster.",
      slots: ["root", "button"],
      accessibility: [
        "Uses role group.",
        "Add aria-label or aria-labelledby when the grouped actions need a name.",
        "Keeps child button focus rings above adjacent controls.",
      ],
      usage: [
        "Use for related actions of the same scope.",
        "Keep groups small, usually two to four actions.",
        "Use vertical orientation only in constrained side panels.",
      ],
      avoid: ["Do not group unrelated primary actions."],
    },
  },
  {
    name: "badge",
    title: "Badge",
    description: "A compact status label for metadata, state, and categorization.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "badge.tsx", content: badgeSource, target: "ui/badge.tsx" }],
    metadata: {
      purpose: "Labels objects with short status or category text.",
      slots: ["root", "label"],
      accessibility: ["Uses readable text by default.", "Avoid color-only meaning."],
      usage: ["Use one or two words.", "Pair semantic color with clear copy."],
      avoid: ["Do not use for primary actions.", "Do not use long sentences."],
    },
  },
  {
    name: "aspect-ratio",
    title: "Aspect Ratio",
    description: "A ratio-preserving media wrapper for previews, thumbnails, and embeds.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [
      { path: "aspect-ratio.tsx", content: aspectRatioSource, target: "ui/aspect-ratio.tsx" },
    ],
    metadata: {
      purpose: "Keeps media and preview surfaces at a predictable aspect ratio.",
      slots: ["root", "content"],
      accessibility: [
        "Preserves the semantics of children.",
        "Images and embeds inside still need their own accessible names.",
      ],
      usage: [
        "Use ratio={16 / 9} for previews and video.",
        "Use ratio={1} for square thumbnails.",
        "Put images, iframes, or preview surfaces inside the wrapper.",
      ],
      avoid: ["Do not crop meaningful content without an alternate way to access it."],
    },
  },
  {
    name: "photo",
    title: "Photo",
    description: "A tokenized image primitive with ratio, fallback, caption, and reveal micro UX.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "photo.tsx", content: photoSource, target: "ui/photo.tsx" }],
    metadata: {
      purpose: "Renders product imagery, thumbnails, avatars-at-scale, and media previews.",
      slots: ["root", "image", "tint", "fallback", "caption"],
      accessibility: [
        "PhotoImage requires meaningful alt text unless the image is decorative.",
        "PhotoFallback remains visible when the image fails to load.",
        "PhotoCaption uses figcaption semantics through the parent figure.",
      ],
      usage: [
        "Use ratio to reserve space and prevent layout shift.",
        "Use crop square or circle for fixed 1:1 crops; circle overrides radius.",
        "Use PhotoImage filter presets for repeatable image treatment.",
        "Use PhotoTint for tokenized or custom color overlays.",
        "Use variant surface for ordinary media cards.",
        "Use radius to align image corners with surrounding surfaces.",
        "Use PhotoCaption only when the caption describes the image, not as decoration.",
      ],
      avoid: [
        "Do not use background images for meaningful content.",
        "Do not omit alt text for informative images.",
        "Do not crop important product details without a fallback view.",
      ],
    },
  },
  {
    name: "avatar",
    title: "Avatar",
    description: "A user/object avatar with image fallback, size presets, and status presence.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "avatar.tsx", content: avatarSource, target: "ui/avatar.tsx" }],
    metadata: {
      purpose: "Represents a person, team, workspace, or object identity.",
      slots: ["root", "image", "fallback", "status"],
      accessibility: [
        "Use meaningful alt text for profile images or empty alt for decorative avatars.",
        "Fallback text remains visible when the image fails.",
        "Status exposes a short status label.",
      ],
      usage: [
        "Use initials as fallback for people and short labels for workspaces.",
        "Use status only when presence is meaningful.",
        "Keep avatar sizes consistent inside dense lists.",
      ],
      avoid: ["Do not rely on color alone to identify a person or state."],
    },
  },
  {
    name: "card",
    title: "Card",
    description: "A calm content container with variants and optional hover/press micro UX.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "card.tsx", content: cardSource, target: "ui/card.tsx" }],
    metadata: {
      purpose: "Groups related UI into a scannable surface.",
      slots: ["root", "header", "title", "description", "content", "footer"],
      accessibility: [
        "Preserves semantic children.",
        "Headings remain author-controlled.",
        "Interactive cards still need a real link or button for navigation/actions.",
      ],
      usage: [
        "Use surface for ordinary groups.",
        "Use elevated for raised dashboard summaries.",
        "Use accent for selected or highlighted information.",
        "Use beam for premium live, AI, processing, or highlighted states.",
        "Set beam from app state for live processing states, for example beam={isProcessing}.",
        "Set interactive when the card represents a clickable target.",
      ],
      avoid: ["Do not nest too many cards.", "Do not use cards as random decoration."],
    },
  },
  {
    name: "text",
    title: "Text",
    description: "A typography primitive with muted, glow, and shimmer variants.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "text.tsx", content: textSource, target: "ui/text.tsx" }],
    metadata: {
      purpose: "Renders short UI copy, premium states, and animated emphasis text.",
      slots: ["root", "content"],
      accessibility: [
        "Renders real text, not an image.",
        "Shimmer animation is disabled for reduced-motion users.",
        "Use semantic elements through the as prop when needed.",
      ],
      usage: [
        "Use default or muted for ordinary copy.",
        "Use glow for premium status labels and AI states.",
        "Use shimmer for short loading, generating, or live processing text.",
        "Override shimmerColor per use, or set --brilliant-text-shimmer-highlight globally.",
        "Keep animated text short and meaningful.",
      ],
      avoid: [
        "Do not use shimmer for paragraphs.",
        "Do not rely on animation alone to communicate state.",
      ],
    },
  },
  {
    name: "input",
    title: "Input",
    description: "A crisp text field with focus, invalid, disabled, and tokenized styling.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "input.tsx", content: inputSource, target: "ui/input.tsx" }],
    metadata: {
      purpose: "Collects short freeform text, search, numbers, URLs, or emails.",
      slots: ["root"],
      accessibility: ["Pair with a label.", "Supports aria-invalid for error state."],
      usage: [
        "Use type-specific inputs where possible.",
        "Include helpful placeholder text sparingly.",
      ],
      avoid: ["Do not rely on placeholder as the only label."],
    },
  },
  {
    name: "label",
    title: "Label",
    description: "A form label primitive tuned for dense enterprise layouts.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "label.tsx", content: labelSource, target: "ui/label.tsx" }],
    metadata: {
      purpose: "Names a form control.",
      slots: ["root"],
      accessibility: ["Use htmlFor to connect labels to controls."],
      usage: ["Keep labels concise.", "Use helper text for extra instructions."],
      avoid: ["Do not replace labels with placeholders."],
    },
  },
  {
    name: "textarea",
    title: "Textarea",
    description: "A multiline field with Brilliant focus and invalid states.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "textarea.tsx", content: textareaSource, target: "ui/textarea.tsx" }],
    metadata: {
      purpose: "Collects longer freeform text.",
      slots: ["root"],
      accessibility: ["Pair with a label.", "Supports aria-invalid for error state."],
      usage: ["Use for notes, prompts, comments, and descriptions."],
      avoid: ["Do not use for single-line values."],
    },
  },
  {
    name: "field",
    title: "Field",
    description: "Form field composition for label, help text, and error states.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "field.tsx", content: fieldSource, target: "ui/field.tsx" }],
    metadata: {
      purpose: "Composes labels, controls, descriptions, and validation messages.",
      slots: ["root", "label", "description", "error", "group"],
      accessibility: [
        "Use htmlFor on FieldLabel to connect it to the control.",
        "Use aria-describedby to connect descriptions and errors.",
        "FieldError uses role alert.",
      ],
      usage: ["Use for every non-trivial form control.", "Keep error copy specific."],
      avoid: ["Do not rely on placeholder text as the only label."],
    },
  },
  {
    name: "checkbox",
    title: "Checkbox",
    description: "A native checkbox with tokenized states and press micro UX.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "checkbox.tsx", content: checkboxSource, target: "ui/checkbox.tsx" }],
    metadata: {
      purpose: "Toggles a binary option or selects items in a set.",
      slots: ["root", "input", "control", "indicator"],
      accessibility: [
        "Uses a native checkbox input.",
        "Pair with a visible label.",
        "Supports indeterminate state for mixed selections.",
        "Focus is always visible for keyboard users.",
      ],
      usage: [
        "Use for independent boolean choices.",
        "Use size lg when the checkbox is the primary control in a settings row.",
        "Use indeterminate for partial table or tree selections.",
        "Use variant critical only for destructive selection contexts.",
      ],
      avoid: ["Do not use for immediate on/off settings when Switch is clearer."],
    },
  },
  {
    name: "switch",
    title: "Switch",
    description: "A native switch-style checkbox for immediate on/off settings.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "switch.tsx", content: switchSource, target: "ui/switch.tsx" }],
    metadata: {
      purpose: "Toggles an immediate setting.",
      slots: ["root", "thumb"],
      accessibility: ["Uses a native checkbox with role switch.", "Pair with a visible label."],
      usage: ["Use for settings that take effect immediately."],
      avoid: ["Do not use for form submission choices that need review."],
    },
  },
  {
    name: "radio-group",
    title: "Radio Group",
    description: "A native radio choice group with tokenized states and dot micro UX.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "radio-group.tsx", content: radioGroupSource, target: "ui/radio-group.tsx" }],
    metadata: {
      purpose: "Lets users choose exactly one option from a related set.",
      slots: ["root", "item", "input", "control", "indicator", "label", "description"],
      accessibility: [
        "Uses native radio inputs for form submission and keyboard behavior.",
        "Give related items the same name.",
        "Label the group with a legend or aria-label.",
        "Focus is always visible for keyboard users.",
      ],
      usage: [
        "Use for mutually exclusive choices.",
        "Use description for plan, permission, or policy context.",
        "Use orientation horizontal only for short, low-density choices.",
        "Use variant critical only for high-risk choices.",
      ],
      avoid: ["Do not use when multiple selections are allowed; use Checkbox instead."],
    },
  },
  {
    name: "slider",
    title: "Slider",
    description: "A native range control with Brilliant focus and thumb styling.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "slider.tsx", content: sliderSource, target: "ui/slider.tsx" }],
    metadata: {
      purpose: "Adjusts a numeric value within a bounded range.",
      slots: ["root", "track", "thumb"],
      accessibility: [
        "Uses a native range input.",
        "Provide aria-label or a connected label.",
        "Keyboard behavior is handled by the browser.",
      ],
      usage: [
        "Use for continuous values.",
        "Use visible min/max/value text when precision matters.",
      ],
      avoid: ["Do not use for exact numeric entry without an input fallback."],
    },
  },
  {
    name: "select",
    title: "Select",
    description: "A Radix-powered select with Brilliant trigger, dropdown, and item styling.",
    kind: "component",
    dependencies: ["@radix-ui/react-select"],
    registryDependencies: [],
    files: [{ path: "select.tsx", content: selectSource, target: "ui/select.tsx" }],
    metadata: {
      purpose: "Chooses one option from a compact, fully styled dropdown menu.",
      slots: ["root", "trigger", "value", "content", "viewport", "item", "indicator"],
      accessibility: [
        "Uses Radix Select for keyboard navigation and managed ARIA behavior.",
        "Pair the trigger with a visible label or aria-label.",
        "Items expose selected and highlighted states without relying on color alone.",
      ],
      usage: [
        "Use for short known option lists.",
        "Use SelectItem for every selectable option.",
        "Prefer Combobox or Command when users need search.",
      ],
      avoid: ["Do not use for native mobile-only pickers where OS controls are required."],
    },
  },
  {
    name: "combobox",
    title: "Combobox",
    description: "A styled searchable listbox combobox with Brilliant micro UX.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "combobox.tsx", content: comboboxSource, target: "ui/combobox.tsx" }],
    metadata: {
      purpose: "Lets users type or choose from suggested options.",
      slots: ["root", "input", "listbox", "option", "indicator", "empty"],
      accessibility: [
        "Uses combobox and listbox roles with active descendant state.",
        "Pair with a visible label or aria-label.",
        "Supports keyboard open, close, arrow navigation, and enter selection.",
      ],
      usage: [
        "Use for searchable suggestions and short-to-medium option lists.",
        "Pass options as value/label objects.",
        "Use Command for richer command palettes or grouped actions.",
      ],
      avoid: [
        "Do not use for very large async datasets without virtualization or server filtering.",
      ],
    },
  },
  {
    name: "alert",
    title: "Alert",
    description: "A semantic message surface for status, guidance, and errors.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "alert.tsx", content: alertSource, target: "ui/alert.tsx" }],
    metadata: {
      purpose: "Communicates important contextual feedback.",
      slots: ["root", "title", "description"],
      accessibility: ["Uses role status by default.", "Use clear text, not color alone."],
      usage: ["Use near the related task or form region."],
      avoid: ["Do not overuse persistent alerts."],
    },
  },
  {
    name: "dialog",
    title: "Dialog",
    description: "A native modal surface with header, content, and footer slots.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "dialog.tsx", content: dialogSource, target: "ui/dialog.tsx" }],
    metadata: {
      purpose: "Shows focused content or tasks above the page.",
      slots: ["root", "header", "title", "description", "content", "footer"],
      accessibility: ["Uses native dialog semantics.", "Use showModal() and provide a title."],
      usage: ["Use for focused tasks.", "Keep actions in the footer."],
      avoid: ["Do not put long multi-page flows in one dialog."],
    },
  },
  {
    name: "alert-dialog",
    title: "Alert Dialog",
    description: "A confirmation dialog for destructive or high-risk decisions.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [
      { path: "alert-dialog.tsx", content: alertDialogSource, target: "ui/alert-dialog.tsx" },
    ],
    metadata: {
      purpose: "Confirms destructive, irreversible, or high-risk actions.",
      slots: ["root", "header", "title", "description", "content", "footer"],
      accessibility: ["Uses native dialog semantics.", "Use clear confirm and cancel actions."],
      usage: ["Use for destructive confirmation.", "Make consequences explicit."],
      avoid: ["Do not use for ordinary informational messages."],
    },
  },
  {
    name: "drawer",
    title: "Drawer",
    description: "A native dialog-based drawer for bottom or side panels.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "drawer.tsx", content: drawerSource, target: "ui/drawer.tsx" }],
    metadata: {
      purpose: "Shows contextual panels without leaving the page.",
      slots: ["root", "header", "title", "description", "content"],
      accessibility: ["Uses native dialog semantics.", "Provide a title."],
      usage: ["Use for mobile panels and contextual editors."],
      avoid: ["Do not hide primary page navigation in nested drawers."],
    },
  },
  {
    name: "sheet",
    title: "Sheet",
    description: "A side-panel primitive for settings, filters, and secondary workflows.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "sheet.tsx", content: sheetSource, target: "ui/sheet.tsx" }],
    metadata: {
      purpose: "Shows secondary workflows in a side or edge panel.",
      slots: ["root", "header", "title", "description", "content"],
      accessibility: ["Uses native dialog semantics.", "Provide a title."],
      usage: ["Use for filters, settings, and object details."],
      avoid: ["Do not use sheets for global blocking confirmations."],
    },
  },
  {
    name: "dropdown-menu",
    title: "Dropdown Menu",
    description: "A Radix-powered contextual menu for secondary actions and option sets.",
    kind: "component",
    dependencies: ["@radix-ui/react-dropdown-menu"],
    registryDependencies: [],
    files: [
      { path: "dropdown-menu.tsx", content: dropdownMenuSource, target: "ui/dropdown-menu.tsx" },
    ],
    metadata: {
      purpose: "Shows contextual actions from a trigger without taking over the page.",
      slots: [
        "root",
        "trigger",
        "content",
        "item",
        "checkbox-item",
        "radio-item",
        "label",
        "separator",
      ],
      accessibility: [
        "Uses Radix Dropdown Menu for keyboard navigation and menu semantics.",
        "Keep destructive actions clearly labeled.",
        "Do not make menu-only actions essential.",
      ],
      usage: [
        "Use for secondary object actions.",
        "Use checkbox or radio items for compact menu preferences.",
        "Keep menus short and grouped with labels or separators.",
      ],
      avoid: ["Do not use dropdown menus for primary page navigation."],
    },
  },
  {
    name: "tooltip",
    title: "Tooltip",
    description: "A small hover/focus hint for controls and terse UI.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "tooltip.tsx", content: tooltipSource, target: "ui/tooltip.tsx" }],
    metadata: {
      purpose: "Adds short non-essential helper text.",
      slots: ["root", "trigger", "content"],
      accessibility: ["Visible on hover and focus-within.", "Keep content short."],
      usage: ["Use for icon buttons and terse controls."],
      avoid: ["Do not hide required instructions only in a tooltip."],
    },
  },
  {
    name: "popover",
    title: "Popover",
    description: "A lightweight disclosure popover for compact contextual content.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "popover.tsx", content: popoverSource, target: "ui/popover.tsx" }],
    metadata: {
      purpose: "Reveals compact contextual content.",
      slots: ["root", "trigger", "content"],
      accessibility: ["Uses native details/summary disclosure behavior."],
      usage: ["Use for compact filters, quick settings, and small menus."],
      avoid: ["Do not use for destructive confirmation."],
    },
  },
  {
    name: "hover-card",
    title: "Hover Card",
    description: "A hover/focus card for richer previews.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "hover-card.tsx", content: hoverCardSource, target: "ui/hover-card.tsx" }],
    metadata: {
      purpose: "Shows a richer preview for an object or person.",
      slots: ["root", "trigger", "content"],
      accessibility: [
        "Use only for supplemental information.",
        "Do not require hover-only content.",
      ],
      usage: ["Use for user, team, or object previews."],
      avoid: ["Do not hide required actions inside hover cards."],
    },
  },
  {
    name: "context-menu",
    title: "Context Menu",
    description: "A right-click contextual action menu.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [
      { path: "context-menu.tsx", content: contextMenuSource, target: "ui/context-menu.tsx" },
    ],
    metadata: {
      purpose: "Provides contextual actions for an object or region.",
      slots: ["root", "menu", "item"],
      accessibility: [
        "Expose critical actions elsewhere too.",
        "Keyboard-managed menu can be upgraded with Radix.",
      ],
      usage: ["Use for secondary object actions."],
      avoid: ["Do not make context menu the only way to complete a key task."],
    },
  },
  {
    name: "separator",
    title: "Separator",
    description: "A semantic divider for grouping related content.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "separator.tsx", content: separatorSource, target: "ui/separator.tsx" }],
    metadata: {
      purpose: "Separates content groups visually and semantically.",
      slots: ["root"],
      accessibility: [
        "Decorative by default.",
        "Set decorative=false when the separator conveys meaningful structure.",
        "Sets aria-orientation for non-decorative separators.",
      ],
      usage: [
        "Use variant default for normal dividers.",
        "Use variant muted for subtle grouping.",
        "Use variant primary only for active or branded section breaks.",
      ],
      avoid: ["Do not use as decoration when spacing is enough."],
    },
  },
  {
    name: "skeleton",
    title: "Skeleton",
    description: "A loading placeholder with shimmer, shape presets, and reduced-motion behavior.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "skeleton.tsx", content: skeletonSource, target: "ui/skeleton.tsx" }],
    metadata: {
      purpose: "Reserves layout space while content loads.",
      slots: ["root"],
      accessibility: [
        "Hidden from assistive technology.",
        "Pair with real loading state when needed.",
        "Shimmer animation is disabled for reduced-motion users.",
      ],
      usage: [
        "Use size text or title for copy placeholders.",
        "Use size avatar, thumbnail, or card to match incoming layout.",
        "Use variant raised or primary only when the loading surface needs stronger hierarchy.",
      ],
      avoid: ["Do not show skeletons for very fast operations."],
    },
  },
  {
    name: "progress",
    title: "Progress",
    description: "A determinate or indeterminate progress indicator with tokenized motion.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "progress.tsx", content: progressSource, target: "ui/progress.tsx" }],
    metadata: {
      purpose: "Shows task completion or ongoing work.",
      slots: ["root", "indicator"],
      accessibility: [
        "Uses role progressbar.",
        "Sets aria-valuenow only for determinate progress.",
        "Provide aria-label or connect visible text with aria-labelledby.",
        "Indeterminate motion is disabled for reduced-motion users.",
      ],
      usage: [
        "Use value and max for known progress.",
        "Use indeterminate when progress cannot be measured.",
        "Keep critical progress for risky, blocking, or destructive flows.",
      ],
      avoid: ["Do not show fake percentages when progress is unknown."],
    },
  },
  {
    name: "spinner",
    title: "Spinner",
    description: "A compact loading status primitive with accessible status text.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "spinner.tsx", content: spinnerSource, target: "ui/spinner.tsx" }],
    metadata: {
      purpose: "Indicates short, local loading work.",
      slots: ["root", "icon", "label"],
      accessibility: [
        "Uses role status.",
        "Includes screen-reader-only loading text by default.",
        "Animation is disabled for reduced-motion users.",
      ],
      usage: [
        "Use inside buttons, table cells, and compact loading regions.",
        "Set label to describe the loading operation for assistive technology.",
        "Use muted when the spinner is secondary to nearby loading copy.",
      ],
      avoid: ["Do not use for long-running work without descriptive progress text."],
    },
  },
  {
    name: "empty-state",
    title: "Empty State",
    description: "A calm empty-region primitive for no data, no results, and first-run states.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "empty-state.tsx", content: emptyStateSource, target: "ui/empty-state.tsx" }],
    metadata: {
      purpose: "Explains why a region is empty and offers a useful next action.",
      slots: ["root", "icon", "title", "description", "actions"],
      accessibility: [
        "Uses semantic headings authored by the consumer.",
        "Actions remain real buttons or links.",
        "Entry motion is disabled for reduced-motion users.",
      ],
      usage: [
        "Use title and description to explain the empty state clearly.",
        "Use actions only when there is a meaningful next step.",
        "Use ghost inside already bordered parent surfaces.",
      ],
      avoid: ["Do not use empty states as marketing panels inside component docs."],
    },
  },
  {
    name: "tabs",
    title: "Tabs",
    description: "A Radix-powered tab primitive for switching related panels.",
    kind: "component",
    dependencies: ["@radix-ui/react-tabs"],
    registryDependencies: [],
    files: [{ path: "tabs.tsx", content: tabsSource, target: "ui/tabs.tsx" }],
    metadata: {
      purpose: "Switches between related content panels.",
      slots: ["root", "list", "trigger", "content"],
      accessibility: [
        "Uses Radix Tabs for tablist, tab, tabpanel, roving focus, and keyboard behavior.",
        "Use matching value props on triggers and content panels.",
        "Focus states are visible for keyboard users.",
      ],
      usage: [
        "Use for peer sections of one context.",
        "Keep tab labels short.",
        "Use defaultValue for uncontrolled tabs or value/onValueChange for controlled tabs.",
      ],
      avoid: ["Do not use tabs as primary page navigation."],
    },
  },
  {
    name: "accordion",
    title: "Accordion",
    description: "A details-based accordion for stacked disclosure sections.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "accordion.tsx", content: accordionSource, target: "ui/accordion.tsx" }],
    metadata: {
      purpose: "Shows and hides stacked sections.",
      slots: ["root", "item", "trigger", "content"],
      accessibility: ["Uses native details/summary disclosure behavior."],
      usage: ["Use for FAQs, settings groups, and optional detail sections."],
      avoid: ["Do not hide required form fields in collapsed sections by default."],
    },
  },
  {
    name: "collapsible",
    title: "Collapsible",
    description: "A single disclosure primitive for optional content.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "collapsible.tsx", content: collapsibleSource, target: "ui/collapsible.tsx" }],
    metadata: {
      purpose: "Shows or hides one content region.",
      slots: ["root", "trigger", "content"],
      accessibility: ["Uses native details/summary disclosure behavior."],
      usage: ["Use for optional controls and advanced sections."],
      avoid: ["Do not hide critical information by default."],
    },
  },
  {
    name: "carousel",
    title: "Carousel",
    description: "A controlled carousel primitive with viewport, track, items, controls, and dots.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "carousel.tsx", content: carouselSource, target: "ui/carousel.tsx" }],
    metadata: {
      purpose: "Displays a small sequence of cards or previews with explicit navigation controls.",
      slots: ["root", "viewport", "track", "item", "previous", "next", "dots"],
      accessibility: [
        "Navigation controls have accessible labels.",
        "Disabled controls communicate start and end positions.",
        "Do not auto-advance content.",
      ],
      usage: [
        "Use itemCount to wire control state.",
        "Use CarouselViewport, CarouselTrack, and CarouselItem for the slide structure.",
        "Use dots for short carousels where position matters.",
      ],
      avoid: ["Do not hide essential content in carousels."],
    },
  },
  {
    name: "table",
    title: "Table",
    description: "A crisp semantic table primitive for enterprise data surfaces.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "table.tsx", content: tableSource, target: "ui/table.tsx" }],
    metadata: {
      purpose: "Displays structured rows and columns with dense, readable defaults.",
      slots: ["root", "caption", "header", "body", "footer", "row", "head", "cell"],
      accessibility: [
        "Uses semantic table elements.",
        "Use TableHead for column headers.",
        "Add captions when context is not otherwise clear.",
      ],
      usage: [
        "Use for simple data display.",
        "Use selected row state with data-state=selected.",
        "Use Data Table blocks later for sorting, filtering, and pagination.",
      ],
      avoid: ["Do not use tables for layout."],
    },
  },
  {
    name: "form",
    title: "Form",
    description: "A form composition primitive for sections, copy, and action rows.",
    kind: "component",
    dependencies: [],
    registryDependencies: ["field"],
    files: [{ path: "form.tsx", content: formSource, target: "ui/form.tsx" }],
    metadata: {
      purpose: "Composes product-grade forms from sections, field groups, and action rows.",
      slots: ["root", "section", "header", "title", "description", "actions"],
      accessibility: [
        "Preserves native form semantics.",
        "Pair controls with Field and Label primitives.",
        "Use real submit buttons for form submission.",
      ],
      usage: [
        "Use FormSection for grouped settings.",
        "Use FormActions for cancel/save affordances.",
        "Use Field for label, description, and validation state.",
      ],
      avoid: ["Do not hide required fields in decorative cards."],
    },
  },
  {
    name: "scroll-area",
    title: "Scroll Area",
    description: "A Radix-powered scroll container with Brilliant scrollbar styling.",
    kind: "component",
    dependencies: ["@radix-ui/react-scroll-area"],
    registryDependencies: [],
    files: [{ path: "scroll-area.tsx", content: scrollAreaSource, target: "ui/scroll-area.tsx" }],
    metadata: {
      purpose: "Contains overflow content without browser-default scrollbar chrome.",
      slots: ["root", "viewport", "scrollbar", "thumb", "corner"],
      accessibility: [
        "Uses native scrolling behavior through Radix Scroll Area.",
        "Do not trap keyboard focus inside scroll regions.",
        "Give long regions a visible heading or label nearby.",
      ],
      usage: [
        "Use for menus, sidebars, activity feeds, and constrained panels.",
        "Keep essential content discoverable outside tiny scroll areas.",
      ],
      avoid: ["Do not replace normal page scrolling without a strong reason."],
    },
  },
  {
    name: "breadcrumb",
    title: "Breadcrumb",
    description: "A semantic breadcrumb navigation primitive.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "breadcrumb.tsx", content: breadcrumbSource, target: "ui/breadcrumb.tsx" }],
    metadata: {
      purpose: "Shows the current location in a hierarchy.",
      slots: ["root", "list", "item", "separator"],
      accessibility: ["Uses nav with aria-label Breadcrumb."],
      usage: ["Use for nested apps and object hierarchies."],
      avoid: ["Do not use as the only navigation."],
    },
  },
  {
    name: "navigation-menu",
    title: "Navigation Menu",
    description: "A simple semantic navigation menu primitive.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "navigation-menu.tsx",
        content: navigationMenuSource,
        target: "ui/navigation-menu.tsx",
      },
    ],
    metadata: {
      purpose: "Groups primary or secondary navigation links.",
      slots: ["root", "link"],
      accessibility: ["Uses nav semantics.", "Links remain real anchors."],
      usage: ["Use for top bars and side sections."],
      avoid: ["Do not use buttons for navigation destinations."],
    },
  },
  {
    name: "header",
    title: "Header",
    description:
      "A responsive site header with sticky, fixed, and static positioning plus built-in mobile navigation.",
    kind: "layout",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "header.tsx", content: headerSource, target: "ui/header.tsx" }],
    metadata: {
      purpose:
        "Provides persistent brand, primary navigation, and action placement for product and documentation surfaces.",
      slots: ["root", "container", "brand", "navigation", "link", "actions", "mobile-trigger"],
      accessibility: [
        "Uses semantic header and navigation elements.",
        "Active links expose aria-current=page.",
        "The mobile trigger exposes its expanded state and supports Escape to close.",
        "Navigation destinations remain real anchors.",
      ],
      usage: [
        "Use position=sticky for persistent navigation, static for normal document flow, or fixed for an overlaying global header.",
        "Use HeaderContainer to constrain content width and align the brand, navigation, and actions.",
        "Use HeaderMobileTrigger to expose the navigation below the mobile breakpoint.",
      ],
      avoid: [
        "Do not use position=fixed without adding equivalent top spacing to the page content.",
        "Do not place large forms or multi-level application navigation in a site header.",
      ],
    },
  },
  {
    name: "footer",
    title: "Footer",
    description:
      "A responsive footer composition with brand copy, grouped navigation, legal links, and surface variants.",
    kind: "layout",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "footer.tsx", content: footerSource, target: "ui/footer.tsx" }],
    metadata: {
      purpose:
        "Closes product, documentation, and public pages with structured navigation and ownership information.",
      slots: [
        "root",
        "container",
        "main",
        "brand",
        "description",
        "navigation",
        "group",
        "link",
        "bottom",
      ],
      accessibility: [
        "Uses the semantic footer landmark.",
        "Footer navigation has an accessible label.",
        "Links preserve native anchor behavior and visible keyboard focus.",
        "Group headings provide context without creating fake navigation controls.",
      ],
      usage: [
        "Use variant=surface for most pages, muted for stronger separation, or transparent inside an existing surface.",
        "Use FooterGroup for compact, scannable link columns.",
        "Keep legal and copyright content in FooterBottom.",
      ],
      avoid: [
        "Do not duplicate the full application sidebar in the footer.",
        "Do not use low-contrast links or hide essential legal information.",
      ],
    },
  },
  {
    name: "application-shell",
    title: "Application Shell",
    description:
      "A responsive app frame with header, mobile sidebar, navigation, main, and footer slots.",
    kind: "layout",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "application-shell.tsx",
        content: applicationShellSource,
        target: "ui/application-shell.tsx",
      },
    ],
    metadata: {
      purpose:
        "Provides the outer frame for SaaS apps, dashboards, internal tools, and AI workspaces.",
      slots: [
        "root",
        "header",
        "mobile-trigger",
        "sidebar",
        "brand",
        "search",
        "nav",
        "nav-section",
        "nav-item",
        "nav-media",
        "nav-group-item",
        "menu",
        "menu-section",
        "menu-item",
        "menu-item-media",
        "account-switcher",
        "account-item",
        "main",
        "footer",
      ],
      accessibility: [
        "Sidebar navigation uses nav and anchor semantics.",
        "Mobile navigation closes with Escape and backdrop click.",
        "Active navigation items expose aria-current.",
        "The mobile trigger is a native button with visible focus.",
      ],
      usage: [
        "Use as the top-level frame for authenticated product screens.",
        "Keep primary navigation in ApplicationShellSidebar.",
        "Use NavItem for simple destinations and NavGroupItem for inbox/account rows with secondary text.",
        "Use Menu and AccountSwitcher slots for user/account controls inside the sidebar.",
        "Use menu item icon for action glyphs and media for avatars/account bubbles.",
        "Use ApplicationShellHeader for page actions and the mobile trigger.",
        "Use ApplicationShellMain for route/page content.",
      ],
      avoid: [
        "Do not use for marketing pages or one-off landing layouts.",
        "Do not put every possible destination in the primary sidebar.",
      ],
    },
  },
  {
    name: "onboarding-wizard",
    title: "Onboarding Wizard",
    description:
      "A premium multi-step onboarding flow with step rail, progress, content panel, and actions.",
    kind: "layout",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "onboarding-wizard.tsx",
        content: onboardingWizardSource,
        target: "ui/onboarding-wizard.tsx",
      },
    ],
    metadata: {
      purpose:
        "Guides users through product setup, activation, import, provisioning, or first-run workflows.",
      slots: [
        "root",
        "header",
        "title",
        "description",
        "progress",
        "step-list",
        "step",
        "panel",
        "meta",
        "content",
        "actions",
      ],
      accessibility: [
        "Current step exposes aria-current=step.",
        "Step controls are native buttons with visible focus.",
        "Progress includes visible text and a tokenized progress track.",
        "Entry and interaction motion respects reduced-motion preferences.",
      ],
      usage: [
        "Use for first-run onboarding, workspace setup, imports, and activation checklists.",
        "Keep active step state in the app so form data and navigation are explicit.",
        "Use complete/current/upcoming step states to show progress without hiding skipped steps.",
        "Put real form fields, uploads, or integration cards inside OnboardingWizardContent.",
      ],
      avoid: [
        "Do not use for one-screen settings forms.",
        "Do not block users with unnecessary onboarding steps.",
        "Do not rely only on color to communicate step status.",
      ],
    },
  },
  {
    name: "menubar",
    title: "Menubar",
    description: "A compact command menubar primitive.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "menubar.tsx", content: menubarSource, target: "ui/menubar.tsx" }],
    metadata: {
      purpose: "Groups app-level commands.",
      slots: ["root", "item"],
      accessibility: ["Uses menubar and menuitem roles."],
      usage: ["Use for dense app command surfaces."],
      avoid: ["Do not use menubars for ordinary page links."],
    },
  },
  {
    name: "pagination",
    title: "Pagination",
    description: "A semantic pagination navigation primitive.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "pagination.tsx", content: paginationSource, target: "ui/pagination.tsx" }],
    metadata: {
      purpose: "Navigates paged collections.",
      slots: ["root", "list", "item", "link"],
      accessibility: [
        "Uses nav with aria-label Pagination.",
        "Use aria-current on the current page.",
      ],
      usage: ["Use for paged tables and lists."],
      avoid: ["Do not use pagination for tiny collections."],
    },
  },
  {
    name: "toast",
    title: "Toast",
    description: "A provider-backed toast system for transient status messages.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "toast.tsx", content: toastSource, target: "ui/toast.tsx" }],
    metadata: {
      purpose: "Shows transient non-blocking feedback.",
      slots: ["provider", "region", "toast", "title", "description", "close"],
      accessibility: [
        "ToastRegion uses aria-live polite and role region.",
        "Toast uses role status.",
        "Close controls have accessible labels.",
        "Do not rely on toast for critical decisions.",
      ],
      usage: [
        "Wrap the app or route segment in ToastProvider.",
        "Call useToast().toast(...) from event handlers.",
        "Use variants for default, primary, or critical non-blocking feedback.",
      ],
      avoid: ["Do not use toast as the only error recovery path."],
    },
  },
  {
    name: "calendar",
    title: "Calendar",
    description: "A table foundation for calendar/date-picker composition.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "calendar.tsx", content: calendarSource, target: "ui/calendar.tsx" }],
    metadata: {
      purpose: "Provides a semantic calendar table foundation.",
      slots: ["root", "caption", "row", "cell"],
      accessibility: ["Use table headings for weekdays.", "Use buttons for selectable dates."],
      usage: ["Use as a low-level date picker foundation."],
      avoid: ["Do not use a static calendar for freeform date entry."],
    },
  },
  {
    name: "date-input",
    title: "Date Input",
    description: "A native date input with Brilliant form styling.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "date-input.tsx", content: dateInputSource, target: "ui/date-input.tsx" }],
    metadata: {
      purpose: "Collects a date using native platform controls.",
      slots: ["root"],
      accessibility: ["Uses native date input.", "Pair with a visible label."],
      usage: ["Use for straightforward date entry."],
      avoid: ["Do not use when users need date ranges or complex calendar constraints."],
    },
  },
  {
    name: "command",
    title: "Command",
    description: "A command palette/listbox foundation.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "command.tsx", content: commandSource, target: "ui/command.tsx" }],
    metadata: {
      purpose: "Builds command palettes and searchable action lists.",
      slots: ["root", "input", "list", "item"],
      accessibility: [
        "Uses listbox and option roles.",
        "Manage filtering and active state in app code.",
      ],
      usage: ["Use for command palettes, jump menus, and searchable actions."],
      avoid: ["Do not use without keyboard behavior for complex command centers."],
    },
  },
] as const satisfies readonly RegistryItem[];

export function findRegistryItem(name: string): RegistryItem | undefined {
  return registry.find((item) => item.name === name);
}

export function checksumContent(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function isSafeRelativePath(path: string): boolean {
  if (path.length === 0) return false;
  if (path.startsWith("/") || path.startsWith("\\")) return false;
  return !path.split(/[\\/]/).includes("..");
}

export function validateRegistryItem(
  item: RegistryItem,
  allItems: readonly RegistryItem[] = registry,
): readonly string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9-]+$/.test(item.name)) errors.push(`${item.name}: invalid item name.`);
  if (!registryKinds.includes(item.kind)) errors.push(`${item.name}: invalid kind "${item.kind}".`);
  if (item.files.length === 0) errors.push(`${item.name}: at least one file is required.`);
  for (const file of item.files) {
    if (!isSafeRelativePath(file.path))
      errors.push(`${item.name}: unsafe file path "${file.path}".`);
    if (file.target && !isSafeRelativePath(file.target)) {
      errors.push(`${item.name}: unsafe target path "${file.target}".`);
    }
    if (file.checksum && file.checksum !== checksumContent(file.content)) {
      errors.push(`${item.name}: checksum mismatch for "${file.path}".`);
    }
  }
  const names = new Set(allItems.map((candidate) => candidate.name));
  for (const dependency of item.registryDependencies) {
    if (!names.has(dependency))
      errors.push(`${item.name}: missing registry dependency "${dependency}".`);
  }
  return errors;
}

export function validateRegistry(items: readonly RegistryItem[] = registry): readonly string[] {
  const errors: string[] = [];
  const names = new Set<string>();
  for (const item of items) {
    if (names.has(item.name)) errors.push(`${item.name}: duplicate item name.`);
    names.add(item.name);
    errors.push(...validateRegistryItem(item, items));
  }
  return errors;
}

export function resolveRegistryDependencies(
  names: readonly string[],
  items: readonly RegistryItem[] = registry,
): readonly RegistryItem[] {
  const byName = new Map(items.map((item) => [item.name, item]));
  const resolved: RegistryItem[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const visit = (name: string): void => {
    if (visited.has(name)) return;
    if (visiting.has(name)) throw new Error(`Circular registry dependency involving "${name}".`);
    const item = byName.get(name);
    if (!item) throw new Error(`Unknown registry item "${name}".`);
    visiting.add(name);
    for (const dependency of item.registryDependencies) visit(dependency);
    visiting.delete(name);
    visited.add(name);
    resolved.push(item);
  };

  for (const name of names) visit(name);
  return resolved;
}

export function createRegistryArtifacts(
  items: readonly RegistryItem[] = registry,
): RegistryArtifacts {
  const errors = validateRegistry(items);
  if (errors.length > 0) throw new Error(errors.join("\n"));

  const artifacts = Object.fromEntries(
    items.map((item) => [
      item.name,
      {
        ...item,
        version: registrySchemaVersion,
        files: item.files.map((file) => ({
          ...file,
          checksum: file.checksum ?? checksumContent(file.content),
        })),
      },
    ]),
  ) as Record<string, RegistryItemArtifact>;

  return {
    index: {
      version: registrySchemaVersion,
      items: items.map(({ files: _files, ...item }) => item),
    },
    items: artifacts,
  };
}
