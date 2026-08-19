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
  interactive?: boolean;
  variant?: keyof typeof variants;
}

export function Card({
  className = "",
  interactive = false,
  variant = "surface",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-[0.375rem] text-foreground",
        "motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
        variants[variant],
        interactive || variant === "beam"
          ? "hover:-translate-y-px hover:border-primary/30 hover:shadow-md active:translate-y-0 active:scale-[0.995]"
          : "",
        className,
      ].join(" ")}
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

const checkboxSource = `import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export function Checkbox({ className = "", ...props }: CheckboxProps) {
  return (
    <input
      className={[
        "peer size-4 appearance-none rounded-[0.1875rem] border-hairline border-border bg-background shadow-sm",
        "checked:border-primary checked:bg-primary",
        "motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "checked:scale-[0.96] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      type="checkbox"
      {...props}
    />
  );
}
`;

const switchSource = `import type { InputHTMLAttributes } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export function Switch({ className = "", ...props }: SwitchProps) {
  return (
    <input
      className={[
        "h-5 w-9 appearance-none rounded-full border-hairline border-transparent bg-secondary shadow-inner",
        "before:block before:size-4 before:translate-x-0 before:rounded-full before:bg-surface before:shadow-sm before:content-['']",
        "checked:bg-primary checked:before:translate-x-4",
        "motion-safe:transition-[background-color,box-shadow] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "motion-safe:before:transition-transform motion-safe:before:duration-[var(--brilliant-duration-fast)]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      role="switch"
      type="checkbox"
      {...props}
    />
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

const separatorSource = `import type { HTMLAttributes } from "react";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  className = "",
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-orientation={orientation}
      className={[
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[0.5px] w-full" : "h-full w-[0.5px]",
        className,
      ].join(" ")}
      role="separator"
      {...props}
    />
  );
}
`;

const skeletonSource = `import type { HTMLAttributes } from "react";

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-[0.25rem] bg-muted",
        "motion-safe:animate-pulse motion-reduce:animate-none",
        className,
      ].join(" ")}
      aria-hidden="true"
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
        "Set interactive when the card represents a clickable target.",
      ],
      avoid: ["Do not nest too many cards.", "Do not use cards as random decoration."],
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
    name: "checkbox",
    title: "Checkbox",
    description: "A native checkbox with tokenized states and press micro UX.",
    kind: "component",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "checkbox.tsx", content: checkboxSource, target: "ui/checkbox.tsx" }],
    metadata: {
      purpose: "Toggles a binary option or selects items in a set.",
      slots: ["root"],
      accessibility: ["Uses a native checkbox input.", "Pair with a visible label."],
      usage: ["Use for independent boolean choices."],
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
      accessibility: ["Uses role separator.", "Sets aria-orientation."],
      usage: ["Use sparingly between meaningful groups."],
      avoid: ["Do not use as decoration when spacing is enough."],
    },
  },
  {
    name: "skeleton",
    title: "Skeleton",
    description: "A loading placeholder with reduced-motion behavior.",
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
      ],
      usage: ["Match the shape of the incoming content."],
      avoid: ["Do not show skeletons for very fast operations."],
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
