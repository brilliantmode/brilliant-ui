import { registry } from "@brilliant-ui/registry";
import { type ReactNode, StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const navItems = [
  ["Getting Started", "#getting-started"],
  ["Why Brilliant", "#why-brilliant"],
  ["shadcn", "#shadcn"],
  ["Components", "#components"],
  ["Button", "#button"],
  ["Button Group", "#button-group"],
  ["Badge", "#badge"],
  ["Aspect Ratio", "#aspect-ratio"],
  ["Avatar", "#avatar"],
  ["Card", "#card"],
  ["Text", "#text"],
  ["Input", "#input"],
  ["Label", "#label"],
  ["Textarea", "#textarea"],
  ["Checkbox", "#checkbox"],
  ["Switch", "#switch"],
  ["Radio Group", "#radio-group"],
  ["Alert", "#alert"],
  ["Separator", "#separator"],
  ["Skeleton", "#skeleton"],
  ["Progress", "#progress"],
  ["Spinner", "#spinner"],
  ["Empty State", "#empty-state"],
  ["Foundations", "#foundations"],
  ["Blocks", "#blocks"],
  ["Theming", "#theming"],
  ["CLI", "#cli"],
] as const;

const topNavItems = [
  ["Docs", "#getting-started"],
  ["Components", "#components"],
  ["Foundations", "#foundations"],
  ["Blocks", "#blocks"],
  ["Theming", "#theming"],
  ["CLI", "#cli"],
] as const;

const buttonVariants = [
  [
    "Default",
    "Save changes",
    "bg-primary text-primary-foreground hover:-translate-y-px hover:bg-primary/92 active:translate-y-0 active:scale-[0.99] active:bg-primary/88",
  ],
  [
    "Secondary",
    "Secondary",
    "border border-border bg-surface text-foreground shadow-sm hover:-translate-y-px hover:border-foreground/40 hover:bg-muted hover:shadow-md active:translate-y-0 active:scale-[0.99] active:bg-secondary active:shadow-sm",
  ],
  [
    "Outline",
    "Outline",
    "border border-border bg-background text-foreground hover:border-foreground/50 hover:bg-muted active:scale-[0.99] active:bg-secondary",
  ],
  [
    "Ghost",
    "Ghost",
    "border border-transparent text-foreground hover:bg-muted active:scale-[0.99] active:bg-secondary",
  ],
  [
    "Critical",
    "Delete",
    "border border-critical bg-critical text-critical-foreground shadow-sm hover:-translate-y-px hover:bg-critical/92 hover:shadow-md active:translate-y-0 active:scale-[0.99] active:bg-critical/88 active:shadow-sm",
  ],
] as const;

const buttonSizes = [
  ["Small", "h-8 px-3 text-xs"],
  ["Default", "h-9 px-3.5 text-sm"],
  ["Large", "h-10 px-[1.125rem] text-sm"],
  ["Icon", "size-9 px-0 text-sm"],
] as const;

const buttonProps = [
  ["variant", '"primary" | "secondary" | "outline" | "ghost" | "critical"', '"primary"'],
  ["size", '"sm" | "md" | "lg" | "icon"', '"md"'],
  ["type", 'ButtonHTMLAttributes<HTMLButtonElement>["type"]', '"button"'],
  ["className", "string", "undefined"],
] as const;

const foundations = [
  ["Tokens", "Brandable OKLCH color, radius, elevation, typography, density, and motion tokens."],
  ["Themes", "Light, dark, system preference, high-contrast, and brand override contracts."],
  ["Micro UX", "Reusable press, lift, reveal, focus, loading, and reduced-motion primitives."],
  ["Registry", "Versioned shadcn-compatible items with metadata, checksums, and safe paths."],
  ["CLI", "Project init, shadcn alias mapping, dry runs, forced updates, and manifests."],
] as const;

const differentiators = [
  [
    "shadcn-compatible source",
    "Install editable source into your app, keep the familiar aliases, and own the generated files.",
  ],
  [
    "Micro UX built in",
    "Press, lift, reveal, loading, and reduced-motion behavior ship inside component recipes.",
  ],
  [
    "Enterprise defaults",
    "Crisp system typography, restrained motion, keyboard focus, high contrast, and dense layouts.",
  ],
  [
    "Product blocks",
    "SaaS, enterprise, data, and AI screens sit above primitives so teams start closer to real apps.",
  ],
] as const;

const shadcnFlow = [
  ["Initialize", "npx brilliant-ui init"],
  ["Add components", "npx brilliant-ui add button dialog dropdown-menu"],
  ["Own the source", "Edit components/ui/* exactly like a shadcn project"],
] as const;

const blockGroups = [
  ["Application", "App shell, dashboard, settings, authentication, master detail"],
  ["Data", "Tables, audit explorer, usage meters, invoices, charts"],
  ["Forms", "Fields, upload, OTP, wizard, filters, schema renderer"],
  ["AI", "Prompt input, chat thread, tool calls, citations, agent status"],
  ["SaaS", "Billing, API keys, webhooks, members, feature flags"],
  ["Enterprise", "Permissions, roles, policies, org tree, access timeline"],
] as const;

const premiumSystems = [
  ["AI workspace", "Prompt input, tool-call timeline, citations, approvals, agent status"],
  ["Access control", "Roles, permissions, policy builder, audit explorer, identity timeline"],
  ["SaaS operations", "Billing, usage meters, API keys, webhooks, members, feature flags"],
] as const;

const usageByComponent = {
  "button-group": `import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function Example() {
  return (
    <ButtonGroup aria-label="View density">
      <Button variant="secondary">Compact</Button>
      <Button variant="outline">Comfortable</Button>
      <Button variant="outline">Touch</Button>
    </ButtonGroup>
  );
}`,
  badge: `import { Badge } from "@/components/ui/badge";

export function Example() {
  return <Badge variant="primary">Live</Badge>;
}`,
  "aspect-ratio": `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Example() {
  return (
    <AspectRatio ratio={16 / 9}>
      <img alt="Dashboard preview" className="size-full object-cover" src="/preview.png" />
    </AspectRatio>
  );
}`,
  avatar: `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarStatus,
} from "@/components/ui/avatar";

export function Example() {
  return (
    <Avatar size="md">
      <AvatarFallback>NR</AvatarFallback>
      <AvatarImage alt="Nirvana" src="/avatars/nirvana.png" />
      <AvatarStatus status="online" />
    </Avatar>
  );
}`,
  card: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export function Example() {
  const [isProcessing] = useState(true);

  return (
    <Card beam={isProcessing} interactive variant="elevated">
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Current billing period</CardDescription>
      </CardHeader>
      <CardContent>2.4M events</CardContent>
    </Card>
  );
}`,
  text: `import { Text } from "@/components/ui/text";

export function Example() {
  return (
    <Text as="span" shimmerColor="white" size="lg" variant="shimmer">
      Generating workspace insights
    </Text>
  );
}`,
  input: `import { Input } from "@/components/ui/input";

export function Example() {
  return <Input placeholder="workspace@company.com" type="email" />;
}`,
  label: `import { Label } from "@/components/ui/label";

export function Example() {
  return <Label htmlFor="workspace">Workspace name</Label>;
}`,
  textarea: `import { Textarea } from "@/components/ui/textarea";

export function Example() {
  return <Textarea placeholder="Add a launch note..." />;
}`,
  checkbox: `import { Checkbox } from "@/components/ui/checkbox";

export function Example() {
  return (
    <label className="flex items-center gap-3">
      <Checkbox defaultChecked size="lg" />
      <span>Require approval</span>
    </label>
  );
}`,
  switch: `import { Switch } from "@/components/ui/switch";

export function Example() {
  return <Switch aria-label="Enable sync" defaultChecked />;
}`,
  "radio-group": `import { RadioGroup, RadioItem } from "@/components/ui/radio-group";

export function Example() {
  return (
    <RadioGroup aria-label="Billing plan" size="md">
      <RadioItem defaultChecked label="Pro" name="plan" value="pro" />
      <RadioItem
        description="SAML, SCIM, audit logs"
        label="Enterprise"
        name="plan"
        value="enterprise"
        variant="default"
      />
    </RadioGroup>
  );
}`,
  alert: `import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function Example() {
  return (
    <Alert variant="primary">
      <AlertTitle>Sync complete</AlertTitle>
      <AlertDescription>All records are current.</AlertDescription>
    </Alert>
  );
}`,
  separator: `import { Separator } from "@/components/ui/separator";

export function Example() {
  return <Separator variant="primary" />;
}`,
  skeleton: `import { Skeleton } from "@/components/ui/skeleton";

export function Example() {
  return <Skeleton size="title" variant="raised" />;
}`,
  progress: `import { Progress } from "@/components/ui/progress";

export function Example() {
  return <Progress aria-label="Sync progress" value={64} />;
}`,
  spinner: `import { Spinner } from "@/components/ui/spinner";

export function Example() {
  return <Spinner label="Saving settings" size="md" variant="default" />;
}`,
  "empty-state": `import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state";

export function Example() {
  return (
    <EmptyState variant="surface">
      <EmptyStateIcon>⌘</EmptyStateIcon>
      <EmptyStateTitle>No API keys</EmptyStateTitle>
      <EmptyStateDescription>
        Create a key to connect this workspace to your automation pipeline.
      </EmptyStateDescription>
      <EmptyStateActions>{/* Button or link actions */}</EmptyStateActions>
    </EmptyState>
  );
}`,
} as const;

function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "ready" }) {
  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium",
        tone === "ready"
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  children,
  description,
  id,
}: {
  children: ReactNode;
  description: string;
  id: string;
}) {
  return (
    <div className="scroll-mt-24 border-b border-border pb-4" id={id}>
      <h2 className="text-2xl font-semibold tracking-tight">{children}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function PreviewButton({ children, className }: { children: ReactNode; className: string }) {
  return (
    <button
      className={[
        "relative isolate inline-flex shrink-0 appearance-none items-center justify-center gap-2 rounded-[0.25rem] font-medium tracking-[-0.005em]",
        "motion-safe:transition-[color,background-color,border-color,box-shadow,transform,opacity] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-border bg-surface p-4 text-sm leading-6">
      <code>{children}</code>
    </pre>
  );
}

function MiniTerminal({ children }: { children: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-border bg-foreground p-4 text-sm leading-6 text-background">
      <code>{children}</code>
    </pre>
  );
}

function SwitchPreview() {
  const [enabled, setEnabled] = useState(true);

  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="relative inline-grid h-6 w-10 shrink-0 place-items-center">
        <input
          aria-checked={enabled}
          aria-label="Enable sync"
          checked={enabled}
          className="peer absolute inset-0 z-10 h-6 w-10 cursor-pointer appearance-none rounded-full opacity-0"
          onChange={(event) => setEnabled(event.currentTarget.checked)}
          role="switch"
          type="checkbox"
        />
        <span className="pointer-events-none h-6 w-10 rounded-full border border-transparent bg-secondary shadow-inner transition-[background-color,border-color,box-shadow] duration-[var(--brilliant-duration-fast)] peer-checked:bg-primary peer-checked:shadow-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring" />
        <span className="pointer-events-none absolute left-0.5 size-5 rounded-full bg-surface shadow-sm transition-[transform,box-shadow] duration-[var(--brilliant-duration-normal)] ease-[var(--brilliant-ease-spring)] will-change-transform peer-active:scale-x-110 peer-active:scale-y-90 peer-checked:translate-x-4 peer-checked:shadow-sm" />
      </span>
      <span className="text-sm">{enabled ? "Enabled" : "Disabled"}</span>
    </label>
  );
}

function ComponentMiniPreview({ name }: { name: string }) {
  if (name === "button-group") {
    return (
      <div className="inline-flex flex-row items-stretch [&>*]:relative [&>*]:z-0 [&>*:focus-visible]:z-10 [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none">
        {[
          ["Compact", "border border-border bg-surface text-foreground"],
          ["Comfortable", "bg-primary text-primary-foreground"],
          ["Touch", "border border-border bg-surface text-foreground"],
        ].map(([label, className]) => (
          <button
            className={[
              "h-9 rounded-[0.375rem] px-3.5 text-sm font-medium transition-[background-color,border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] hover:-translate-y-px active:translate-y-0 active:scale-[0.99]",
              className,
            ].join(" ")}
            key={label}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  if (name === "badge") {
    return (
      <div className="flex flex-wrap gap-2">
        <span className="rounded-[0.25rem] border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          Live
        </span>
        <span className="rounded-[0.25rem] border border-border bg-muted px-2 py-1 text-xs font-medium">
          Enterprise
        </span>
      </div>
    );
  }

  if (name === "aspect-ratio") {
    return (
      <div className="max-w-md">
        <div
          className="relative overflow-hidden rounded-[0.5rem] bg-muted"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--brilliant-primary)_0%,oklch(0.42_0.18_276)_100%)] text-primary-foreground">
            <span className="rounded-[0.375rem] bg-background/15 px-2 py-1 text-xs font-medium backdrop-blur">
              16:9 preview
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (name === "avatar") {
    return (
      <div className="flex items-end gap-4">
        {[
          ["sm", "NR", "size-7 text-xs", "size-2"],
          ["md", "BU", "size-9 text-sm", "size-2.5"],
          ["lg", "AI", "size-11 text-base", "size-3"],
          ["xl", "UF", "size-14 text-lg", "size-3.5"],
        ].map(([label, initials, rootSize, statusSize]) => (
          <div
            className={[
              "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium uppercase text-muted-foreground shadow-[inset_0_0_0_0.5px_var(--brilliant-control-border)]",
              rootSize,
            ].join(" ")}
            key={label}
          >
            {initials}
            <span
              aria-label="online"
              className={[
                "absolute right-0 bottom-0 rounded-full border-2 border-background bg-primary shadow-sm",
                statusSize,
              ].join(" ")}
              role="status"
            />
          </div>
        ))}
      </div>
    );
  }

  if (name === "card") {
    return (
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Surface", "Neutral group", "border-border bg-surface shadow-sm"],
          ["Elevated", "Dashboard metric", "border-border bg-surface-raised shadow-md"],
          ["Accent", "Selected state", "border-primary/25 bg-primary/5 shadow-sm"],
          [
            "Beam",
            "Live premium state",
            "relative isolate overflow-hidden border-transparent bg-surface shadow-sm before:absolute before:-inset-8 before:z-0 before:rounded-[inherit] before:bg-[conic-gradient(from_0deg,transparent_0_68%,var(--brilliant-ring)_74%,var(--brilliant-primary)_79%,transparent_86%)] before:opacity-70 before:content-[''] motion-safe:before:animate-border-beam motion-reduce:before:animate-none after:absolute after:inset-[0.5px] after:z-0 after:rounded-[calc(0.375rem-0.5px)] after:bg-surface after:content-[''] [&>*]:relative [&>*]:z-10",
          ],
        ].map(([title, description, className]) => (
          <div
            className={[
              "rounded-[0.375rem] border p-3 transition-[border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] hover:-translate-y-px hover:border-primary/30 hover:shadow-md active:translate-y-0 active:scale-[0.995]",
              className,
            ].join(" ")}
            key={title}
          >
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    );
  }

  if (name === "text") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Default", "Revenue intelligence", "text-foreground"],
          ["Muted", "Updated 2 minutes ago", "text-muted-foreground"],
          ["Glow", "AI ready", "text-primary drop-shadow-[0_0_14px_var(--brilliant-primary)]"],
          [
            "Shimmer",
            "Generating workspace insights",
            "bg-[linear-gradient(110deg,var(--brilliant-text-shimmer-base)_0%,var(--brilliant-text-shimmer-text)_18%,var(--brilliant-text-shimmer-highlight)_34%,var(--brilliant-text-shimmer-text)_50%,var(--brilliant-text-shimmer-base)_66%)] bg-[length:240%_100%] bg-clip-text text-transparent motion-safe:animate-text-shimmer motion-reduce:animate-none motion-reduce:bg-none motion-reduce:text-foreground",
          ],
        ].map(([label, copy, className]) => (
          <div className="rounded-[0.375rem] border border-border bg-surface p-4" key={label}>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </p>
            <p className={["mt-2 text-lg font-medium tracking-[-0.01em]", className].join(" ")}>
              {copy}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (name === "input") {
    return (
      <input
        className="h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none transition-shadow focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:ring-0"
        autoComplete="off"
        name="brilliant-input-preview"
        placeholder="Acme workspace"
      />
    );
  }

  if (name === "label") {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="label-preview-workspace">
          Workspace name
        </label>
        <input
          className="h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none transition-shadow focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:ring-0"
          defaultValue="Acme"
          id="label-preview-workspace"
        />
      </div>
    );
  }

  if (name === "textarea") {
    return (
      <textarea
        className="min-h-20 w-full resize-none appearance-none rounded-[0.25rem] border-0 bg-background px-3 py-2 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none transition-shadow focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:ring-0"
        placeholder="Add a launch note..."
      />
    );
  }

  if (name === "checkbox") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Checked", "Require approval", "checked"],
          ["Empty", "Optional export", "empty"],
          ["Mixed", "3 of 8 selected", "mixed"],
        ].map(([label, copy, state]) => (
          <label className="flex items-center gap-4 text-sm" key={label}>
            <span className="relative inline-grid size-6 shrink-0 place-items-center">
              <input
                aria-label={label}
                className="peer absolute inset-0 z-10 size-6 cursor-pointer appearance-none rounded-[0.375rem] opacity-0"
                defaultChecked={state === "checked"}
                ref={(node) => {
                  if (node) node.indeterminate = state === "mixed";
                }}
                type="checkbox"
              />
              <span className="pointer-events-none grid size-6 place-items-center rounded-[0.375rem] border border-control-border bg-background shadow-[inset_0_1px_0_color-mix(in_oklch,white_70%,transparent),inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_12%,transparent)] transition-[background-color,border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] peer-active:scale-[0.92] peer-checked:border-primary peer-checked:bg-primary peer-checked:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)] peer-indeterminate:border-primary peer-indeterminate:bg-primary peer-indeterminate:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)] peer-checked:[&_[data-check]]:opacity-100 peer-checked:[&_[data-check]]:scale-100 peer-indeterminate:[&_[data-check]]:hidden peer-indeterminate:[&_[data-mixed]]:opacity-100 peer-indeterminate:[&_[data-mixed]]:scale-100">
                <svg
                  aria-hidden="true"
                  className="size-4 scale-75 text-primary-foreground opacity-0 transition-[opacity,transform] duration-[var(--brilliant-duration-fast)]"
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
                  className="absolute size-4 scale-75 text-primary-foreground opacity-0 transition-[opacity,transform] duration-[var(--brilliant-duration-fast)]"
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
            <span>
              <span className="block font-medium tracking-[-0.01em]">{label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{copy}</span>
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (name === "switch") {
    return <SwitchPreview />;
  }

  if (name === "radio-group") {
    return (
      <fieldset aria-label="Billing plan" className="grid gap-3">
        {(
          [
            ["pro", "Pro", "Usage, members, and API controls", true],
            ["enterprise", "Enterprise", "SAML, SCIM, audit logs", false],
          ] as const
        ).map(([value, label, description, checked]) => (
          <label className="group/radio flex cursor-pointer items-start gap-3 text-sm" key={value}>
            <span className="relative mt-0.5 inline-grid size-5 shrink-0 place-items-center">
              <input
                className="peer absolute inset-0 z-10 size-5 cursor-pointer appearance-none rounded-full opacity-0"
                defaultChecked={Boolean(checked)}
                name="preview-plan"
                type="radio"
                value={String(value)}
              />
              <span className="pointer-events-none grid size-5 place-items-center rounded-full border border-control-border bg-background shadow-[inset_0_1px_0_color-mix(in_oklch,white_70%,transparent),inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_12%,transparent)] transition-[background-color,border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] peer-active:scale-[0.9] peer-checked:border-primary peer-checked:bg-primary peer-checked:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)] peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-checked:[&_[data-indicator]]:scale-100 peer-checked:[&_[data-indicator]]:opacity-100">
                <span
                  className="size-2 scale-50 rounded-full bg-primary-foreground opacity-0 transition-[opacity,transform] duration-[var(--brilliant-duration-fast)]"
                  data-indicator=""
                />
              </span>
            </span>
            <span className="grid gap-0.5">
              <span className="font-medium tracking-[-0.01em]">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </span>
          </label>
        ))}
      </fieldset>
    );
  }

  if (name === "alert") {
    return (
      <div className="rounded-[0.375rem] border border-primary/25 bg-primary/10 p-3 text-sm">
        <p className="font-semibold">Sync complete</p>
        <p className="mt-1 text-xs text-muted-foreground">All records are current.</p>
      </div>
    );
  }

  if (name === "separator") {
    return (
      <div className="space-y-3 text-sm">
        <p>Account</p>
        <div className="h-[0.5px] w-full bg-primary" />
        <p className="text-muted-foreground">Billing</p>
      </div>
    );
  }

  if (name === "skeleton") {
    return (
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="space-y-3 rounded-[0.5rem] border border-border bg-surface p-4">
          <div className="relative isolate h-6 w-2/3 overflow-hidden rounded-[0.25rem] bg-secondary after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
          <div className="relative isolate h-4 w-full overflow-hidden rounded-[0.25rem] bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
          <div className="relative isolate h-4 w-1/2 overflow-hidden rounded-[0.25rem] bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
        </div>
        <div className="flex items-center gap-3 rounded-[0.5rem] border border-border bg-surface p-4">
          <div className="relative isolate size-10 overflow-hidden rounded-full bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
          <div className="space-y-2">
            <div className="relative isolate h-4 w-28 overflow-hidden rounded-[0.25rem] bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
            <div className="relative isolate h-3 w-20 overflow-hidden rounded-[0.25rem] bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
          </div>
        </div>
      </div>
    );
  }

  if (name === "progress") {
    return (
      <div className="grid gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Syncing records</span>
            <span className="text-muted-foreground">64%</span>
          </div>
          <div
            aria-label="Sync progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={64}
            className="relative isolate h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
          >
            <div className="h-full w-full origin-left scale-x-[0.64] rounded-full bg-primary transition-transform duration-[var(--brilliant-duration-normal)]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Preparing export</div>
          <div
            aria-label="Preparing export"
            className="relative isolate h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
          >
            <div className="h-full w-1/3 rounded-full bg-primary motion-safe:animate-progress-indeterminate motion-reduce:w-full motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    );
  }

  if (name === "spinner") {
    return (
      <div className="flex items-center gap-5">
        {[
          ["sm", "size-4", "text-muted-foreground"],
          ["md", "size-5", "text-primary"],
          ["lg", "size-6", "text-critical"],
        ].map(([label, size, color]) => (
          <span className="inline-flex items-center gap-2 text-sm" key={label}>
            <span className={["inline-flex items-center justify-center", color].join(" ")}>
              <svg
                aria-hidden="true"
                className={["motion-safe:animate-spinner motion-reduce:animate-none", size].join(
                  " ",
                )}
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
            </span>
            <span>{label}</span>
          </span>
        ))}
      </div>
    );
  }

  if (name === "empty-state") {
    return (
      <div className="grid justify-items-center rounded-[0.5rem] border border-border bg-surface p-6 text-center motion-safe:animate-enter motion-reduce:animate-none">
        <div
          aria-hidden="true"
          className="mb-3 grid size-10 place-items-center rounded-full bg-primary/10 text-primary shadow-[inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_20%,transparent)]"
        >
          ⌘
        </div>
        <h3 className="text-base font-semibold tracking-tight">No API keys</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Create a key to connect this workspace to your automation pipeline.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            className={`${buttonVariants[0][2]} h-8 rounded-[0.375rem] px-3 text-xs font-medium`}
            type="button"
          >
            Create key
          </button>
        </div>
      </div>
    );
  }

  return (
    <PreviewButton className={`${buttonVariants[0][2]} h-9 px-3.5 text-sm`}>
      Save changes
    </PreviewButton>
  );
}

function App() {
  const firstItem = registry[0];
  const [activeHref, setActiveHref] = useState<(typeof navItems)[number][1]>("#getting-started");

  useEffect(() => {
    const sectionIds = navItems.map(([, href]) => href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const setActiveFromScroll = () => {
      const currentSection = sections
        .filter((section) => section.getBoundingClientRect().top <= 120)
        .at(-1);

      if (currentSection) {
        setActiveHref(`#${currentSection.id}` as (typeof navItems)[number][1]);
        return;
      }

      const firstSection = sections[0];
      if (firstSection) {
        setActiveHref(`#${firstSection.id}` as (typeof navItems)[number][1]);
      }
    };

    setActiveFromScroll();
    window.addEventListener("scroll", setActiveFromScroll, { passive: true });
    window.addEventListener("hashchange", setActiveFromScroll);

    return () => {
      window.removeEventListener("scroll", setActiveFromScroll);
      window.removeEventListener("hashchange", setActiveFromScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-6 px-4 md:px-6">
          <a className="shrink-0 whitespace-nowrap text-sm font-semibold tracking-tight" href="/">
            Brilliant UI
          </a>
          <nav className="hidden min-w-0 items-center gap-5 overflow-hidden text-sm text-muted-foreground md:flex">
            {topNavItems.map(([label, href]) => (
              <a
                className="shrink-0 whitespace-nowrap hover:text-foreground"
                href={href}
                key={href}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Badge tone="ready">v0.1 foundation</Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl md:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] border-r border-border px-6 py-6 md:block">
          <nav className="space-y-1 text-sm">
            <p className="mb-3 text-xs font-medium uppercase text-muted-foreground">Docs</p>
            {navItems.map(([label, href]) => (
              <a
                aria-current={activeHref === href ? "location" : undefined}
                className={[
                  "block rounded-[0.25rem] border-l-2 px-3 py-2 transition-colors",
                  activeHref === href
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
                href={href}
                key={href}
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 px-4 py-10 md:px-8 lg:px-10">
          <section className="mx-auto max-w-4xl pb-14" id="getting-started">
            <Badge tone="ready">shadcn-compatible enterprise UI</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
              shadcn-compatible components with premium micro UX built in.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Brilliant UI keeps the copy-owned shadcn workflow, then adds brandable tokens,
              enterprise-grade defaults, restrained animation primitives, and product-ready blocks
              for SaaS, internal tools, and AI apps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="inline-flex h-9 items-center rounded-[0.25rem] bg-primary px-4 text-sm font-medium text-primary-foreground"
                href="#cli"
              >
                Get started
              </a>
              <a
                className="inline-flex h-9 items-center rounded-[0.25rem] border border-border px-4 text-sm font-medium"
                href="#components"
              >
                Browse components
              </a>
            </div>
            <div className="mt-8">
              <MiniTerminal>{`npx brilliant-ui init
npx brilliant-ui add button dialog dropdown-menu`}</MiniTerminal>
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="The reason to use Brilliant instead of plain generated components."
              id="why-brilliant"
            >
              Why Brilliant
            </SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              {differentiators.map(([title, description]) => (
                <article className="rounded-lg border border-border bg-surface p-5" key={title}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="Brilliant UI is the front door for shadcn-compatible source components."
              id="shadcn"
            >
              Built on the shadcn model
            </SectionHeading>
            <div className="rounded-lg border border-border bg-surface">
              <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
                {shadcnFlow.map(([title, command]) => (
                  <div className="p-5" key={title}>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-2 font-mono text-xs text-muted-foreground">{command}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  The generated files follow shadcn conventions: Radix where appropriate, Tailwind
                  semantic classes, editable source, components aliases, and app-owned code. The
                  Brilliant layer adds tokens, micro UX, enterprise styling, metadata, and product
                  composition rules.
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="Implemented registry items that can be installed into an app today."
              id="components"
            >
              Components
            </SectionHeading>

            <CodeBlock>{`npx brilliant-ui add ${registry.map((item) => item.name).join(" ")}`}</CodeBlock>

            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="border-b border-border px-4 py-3 font-medium">Component</th>
                    <th className="border-b border-border px-4 py-3 font-medium">Purpose</th>
                    <th className="border-b border-border px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registry.map((item) => (
                    <tr className="border-b border-border last:border-b-0" key={item.name}>
                      <td className="whitespace-nowrap px-4 py-3">
                        <a
                          className="font-medium text-primary hover:underline"
                          href={`#${item.name}`}
                        >
                          {item.title}
                        </a>
                      </td>
                      <td className="min-w-80 px-4 py-3 text-muted-foreground">
                        {item.metadata.purpose}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone="ready">available</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-8 pb-14">
            <div className="scroll-mt-24" id="button">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold tracking-tight">Button</h2>
                <Badge tone="ready">available</Badge>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Displays a button or a component that looks like a button. Use it for actions inside
                forms, dialogs, toolbars, and application screens. Motion, focus, disabled, and
                reduced-motion behavior are part of the generated source.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Installation</h3>
              <CodeBlock>{`pnpm --filter @brilliant-ui/cli dev -- add button`}</CodeBlock>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Usage</h3>
              <CodeBlock>{`import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <Button size="md" variant="primary">
      Save changes
    </Button>
  );
}`}</CodeBlock>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="rounded-lg border border-border bg-background p-6">
                <PreviewButton className={`${buttonVariants[0][2]} h-9 px-3.5 text-sm`}>
                  Save changes
                </PreviewButton>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Variants</h3>
              <div className="rounded-lg border border-border bg-background p-6">
                <div className="flex flex-wrap gap-3">
                  {buttonVariants.map(([label, text, className]) => (
                    <PreviewButton className={`h-9 px-3.5 text-sm ${className}`} key={label}>
                      {text}
                    </PreviewButton>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Sizes</h3>
              <div className="rounded-lg border border-border bg-background p-6">
                <div className="flex flex-wrap items-center gap-3">
                  {buttonSizes.map(([label, className]) => (
                    <PreviewButton className={`${buttonVariants[0][2]} ${className}`} key={label}>
                      {label === "Icon" ? "I" : label}
                    </PreviewButton>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Props</h3>
              <div className="overflow-auto rounded-lg border border-border">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-muted text-left">
                    <tr>
                      <th className="border-b border-border px-4 py-3 font-medium">Prop</th>
                      <th className="border-b border-border px-4 py-3 font-medium">Type</th>
                      <th className="border-b border-border px-4 py-3 font-medium">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buttonProps.map(([name, type, defaultValue]) => (
                      <tr className="border-b border-border last:border-b-0" key={name}>
                        <td className="px-4 py-3 font-mono text-xs">{name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {type}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {defaultValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Accessibility</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                <li>Uses the native button element by default.</li>
                <li>
                  Defaults to <code>type="button"</code> to avoid accidental form submission.
                </li>
                <li>Icon-only buttons must include an accessible label.</li>
                <li>Keyboard focus is visible through the shared Brilliant focus ring.</li>
                <li>Micro animations are disabled through reduced-motion media preferences.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Micro UX contract</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Hover", "Raised buttons lift by 1px and increase elevation."],
                  ["Press", "Actions compress to 99% scale for tactile feedback."],
                  ["Reduce", "Motion is wrapped in motion-safe / motion-reduce classes."],
                ].map(([title, description]) => (
                  <article className="rounded-lg border border-border bg-surface p-4" key={title}>
                    <p className="font-medium">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </article>
                ))}
              </div>
            </div>

            <details className="rounded-lg border border-border bg-surface">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
                Registry metadata
              </summary>
              <div className="border-t border-border p-4">
                <div className="flex flex-wrap gap-2">
                  {firstItem?.metadata.slots.map((slot) => (
                    <Badge key={slot}>{slot}</Badge>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Registry metadata is used by the CLI and AI composition tooling. It is shown here
                  as supporting information, not as the component documentation itself.
                </p>
              </div>
            </details>
          </section>

          {registry
            .filter((item) => item.name !== "button")
            .map((item) => {
              const usage = usageByComponent[item.name as keyof typeof usageByComponent];

              return (
                <section className="mx-auto max-w-4xl space-y-6 pb-14" key={item.name}>
                  <div className="scroll-mt-24 border-b border-border pb-4" id={item.name}>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-semibold tracking-tight">{item.title}</h2>
                      <Badge tone="ready">available</Badge>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Installation</h3>
                    <CodeBlock>{`npx brilliant-ui add ${item.name}`}</CodeBlock>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Usage</h3>
                    <CodeBlock>{usage}</CodeBlock>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <div className="rounded-lg border border-border bg-background p-6">
                      <ComponentMiniPreview name={item.name} />
                    </div>
                  </div>

                  {item.name === "card" ||
                  item.name === "text" ||
                  item.name === "checkbox" ||
                  item.name === "radio-group" ||
                  item.name === "separator" ||
                  item.name === "skeleton" ||
                  item.name === "progress" ||
                  item.name === "spinner" ||
                  item.name === "empty-state" ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Variants</h3>
                      <div className="overflow-auto rounded-lg border border-border">
                        <table className="w-full border-collapse text-sm">
                          <thead className="bg-muted text-left">
                            <tr>
                              <th className="border-b border-border px-4 py-3 font-medium">
                                Variant
                              </th>
                              <th className="border-b border-border px-4 py-3 font-medium">Use</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(item.name === "card"
                              ? [
                                  ["surface", "Default content grouping."],
                                  ["elevated", "Raised dashboard or summary surfaces."],
                                  ["accent", "Selected, highlighted, or recommended content."],
                                  ["beam", "Premium live, AI, processing, or highlighted states."],
                                  ["muted", "Low-emphasis grouping inside denser layouts."],
                                  ["ghost", "Structure without a visible panel."],
                                ]
                              : item.name === "checkbox"
                                ? [
                                    ["default", "Normal selection state."],
                                    ["critical", "Destructive or high-risk selection context."],
                                  ]
                                : item.name === "radio-group"
                                  ? [
                                      ["default", "Normal single-choice selection."],
                                      ["critical", "High-risk or destructive choice context."],
                                    ]
                                  : item.name === "separator"
                                    ? [
                                        ["default", "Standard divider using the border token."],
                                        ["muted", "Subtle divider for dense grouped content."],
                                        ["primary", "Branded or active section divider."],
                                      ]
                                    : item.name === "progress"
                                      ? [
                                          ["default", "Normal progress indication."],
                                          ["critical", "Risky, blocking, or destructive flows."],
                                        ]
                                      : item.name === "spinner"
                                        ? [
                                            ["default", "Primary local loading indicator."],
                                            ["muted", "Secondary loading next to text."],
                                            ["critical", "Loading tied to risky/error recovery."],
                                          ]
                                        : item.name === "empty-state"
                                          ? [
                                              ["surface", "Default empty region panel."],
                                              ["muted", "Lower-emphasis empty region."],
                                              ["ghost", "Use inside an already bordered surface."],
                                            ]
                                          : item.name === "skeleton"
                                            ? [
                                                ["surface", "Default loading placeholder."],
                                                [
                                                  "raised",
                                                  "Slightly stronger placeholder hierarchy.",
                                                ],
                                                [
                                                  "primary",
                                                  "Branded loading placeholder, used sparingly.",
                                                ],
                                              ]
                                            : [
                                                ["default", "Normal UI copy."],
                                                ["muted", "Secondary or supporting copy."],
                                                ["glow", "Premium, active, or AI-ready emphasis."],
                                                [
                                                  "shimmer",
                                                  "Generating, syncing, or live processing text.",
                                                ],
                                              ]
                            ).map(([variant, use]) => (
                              <tr className="border-b border-border last:border-b-0" key={variant}>
                                <td className="px-4 py-3 font-mono text-xs">{variant}</td>
                                <td className="px-4 py-3 text-muted-foreground">{use}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {item.name === "card" ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Set <code>interactive</code> to add hover lift, elevation, and press
                          feedback for clickable card targets. Set{" "}
                          <code>beam=&#123;state&#125;</code> when a card should enter the premium
                          live/processing state from app state.
                        </p>
                      ) : item.name === "checkbox" ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>variant=&quot;critical&quot;</code> only when selecting the
                          option has destructive or high-risk meaning.
                        </p>
                      ) : item.name === "radio-group" ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>variant=&quot;critical&quot;</code> on an individual{" "}
                          <code>RadioItem</code> only when the choice itself carries risk. Items in
                          the same group should share the same <code>name</code>.
                        </p>
                      ) : item.name === "separator" ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>variant=&quot;default&quot;</code>,{" "}
                          <code>variant=&quot;muted&quot;</code>, or{" "}
                          <code>variant=&quot;primary&quot;</code>. The separator is decorative by
                          default; set <code>decorative=&#123;false&#125;</code> when it carries
                          semantic structure.
                        </p>
                      ) : item.name === "skeleton" ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>variant=&quot;surface&quot;</code> for most placeholders. Keep
                          skeletons close to the shape of the incoming content.
                        </p>
                      ) : item.name === "progress" ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>indeterminate</code> when real progress is unknown. Use{" "}
                          <code>value</code> and <code>max</code> only for measured progress.
                        </p>
                      ) : item.name === "spinner" ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>label</code> to describe the loading operation for screen reader
                          users. Prefer <code>variant=&quot;muted&quot;</code> beside visible copy.
                        </p>
                      ) : item.name === "empty-state" ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>variant=&quot;ghost&quot;</code> when the parent already has a
                          visible panel. Keep actions concrete and limited.
                        </p>
                      ) : (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>variant=&quot;shimmer&quot;</code> for short live/processing
                          text. Override the highlight with{" "}
                          <code>shimmerColor=&quot;white&quot;</code> or set{" "}
                          <code>--brilliant-text-shimmer-highlight</code> globally. The animation is
                          disabled for reduced-motion users.
                        </p>
                      )}
                    </div>
                  ) : null}

                  {item.name === "skeleton" ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Sizes</h3>
                      <div className="overflow-auto rounded-lg border border-border">
                        <table className="w-full border-collapse text-sm">
                          <thead className="bg-muted text-left">
                            <tr>
                              <th className="border-b border-border px-4 py-3 font-medium">Prop</th>
                              <th className="border-b border-border px-4 py-3 font-medium">Use</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ["text", "Single body text line."],
                              ["title", "Heading or title line."],
                              ["avatar", "User or object avatar."],
                              ["thumbnail", "Media or preview panel."],
                              ["card", "Large surface placeholder."],
                            ].map(([size, use]) => (
                              <tr className="border-b border-border last:border-b-0" key={size}>
                                <td className="px-4 py-3 font-mono text-xs">{`size="${size}"`}</td>
                                <td className="px-4 py-3 text-muted-foreground">{use}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Set <code>shimmer=&#123;false&#125;</code> to use a calmer pulse animation
                        instead of the default shimmer.
                      </p>
                    </div>
                  ) : null}

                  {item.name === "checkbox" ||
                  item.name === "avatar" ||
                  item.name === "radio-group" ||
                  item.name === "progress" ||
                  item.name === "spinner" ||
                  item.name === "empty-state" ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Sizes</h3>
                      <div className="overflow-auto rounded-lg border border-border">
                        <table className="w-full border-collapse text-sm">
                          <thead className="bg-muted text-left">
                            <tr>
                              <th className="border-b border-border px-4 py-3 font-medium">Prop</th>
                              <th className="border-b border-border px-4 py-3 font-medium">Use</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(item.name === "avatar"
                              ? [
                                  ["sm", "Dense tables, comments, and compact member lists."],
                                  ["md", "Default identity display."],
                                  ["lg", "Profile rows and detail panels."],
                                  ["xl", "Prominent profile headers."],
                                ]
                              : item.name === "radio-group"
                                ? [
                                    ["sm", "Dense settings panels and compact filters."],
                                    ["md", "Default form rows and preference groups."],
                                    ["lg", "Prominent plan, permission, or approval choices."],
                                  ]
                                : item.name === "progress"
                                  ? [
                                      ["sm", "Subtle inline or table-level progress."],
                                      ["md", "Default task progress."],
                                      ["lg", "Prominent page or modal progress."],
                                    ]
                                  : item.name === "spinner"
                                    ? [
                                        ["sm", "Inline button and table-cell loading."],
                                        ["md", "Default compact loading status."],
                                        ["lg", "Prominent empty-state or page-region loading."],
                                      ]
                                    : item.name === "empty-state"
                                      ? [
                                          ["sm", "Compact empty rows and side panels."],
                                          ["md", "Default empty region."],
                                          ["lg", "Primary page or modal empty state."],
                                        ]
                                      : [
                                          ["sm", "Dense tables and compact filter menus."],
                                          ["md", "Default form rows and settings lists."],
                                          [
                                            "lg",
                                            "Prominent settings rows, approvals, and touch-friendly UI.",
                                          ],
                                        ]
                            ).map(([size, use]) => (
                              <tr className="border-b border-border last:border-b-0" key={size}>
                                <td className="px-4 py-3 font-mono text-xs">{`size="${size}"`}</td>
                                <td className="px-4 py-3 text-muted-foreground">{use}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}

                  {item.name === "text" ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Sizes</h3>
                      <div className="overflow-auto rounded-lg border border-border">
                        <table className="w-full border-collapse text-sm">
                          <thead className="bg-muted text-left">
                            <tr>
                              <th className="border-b border-border px-4 py-3 font-medium">Prop</th>
                              <th className="border-b border-border px-4 py-3 font-medium">Use</th>
                              <th className="border-b border-border px-4 py-3 font-medium">
                                Example
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              [
                                "sm",
                                "Supporting labels, timestamps, helper copy.",
                                "Updated 2 minutes ago",
                              ],
                              [
                                "md",
                                "Default body copy and ordinary interface text.",
                                "Workspace usage",
                              ],
                              [
                                "lg",
                                "Emphasis text inside cards, panels, and empty states.",
                                "AI ready",
                              ],
                              [
                                "xl",
                                "Short premium callouts and compact headings.",
                                "Generating insights",
                              ],
                            ].map(([size, use, example]) => (
                              <tr className="border-b border-border last:border-b-0" key={size}>
                                <td className="px-4 py-3 font-mono text-xs">{`size="${size}"`}</td>
                                <td className="px-4 py-3 text-muted-foreground">{use}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className={[
                                      "font-medium tracking-[-0.01em]",
                                      size === "sm" ? "text-sm leading-5" : "",
                                      size === "md" ? "text-base leading-6" : "",
                                      size === "lg" ? "text-lg leading-7" : "",
                                      size === "xl" ? "text-2xl leading-8 tracking-tight" : "",
                                    ].join(" ")}
                                  >
                                    {example}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Use <code>size=&quot;sm&quot;</code>, <code>size=&quot;md&quot;</code>,{" "}
                        <code>size=&quot;lg&quot;</code>, or <code>size=&quot;xl&quot;</code>{" "}
                        alongside any text variant.
                      </p>
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Anatomy</h3>
                      <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-surface p-4">
                        {item.metadata.slots.map((slot) => (
                          <Badge key={slot}>{slot}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Micro UX</h3>
                      <div className="rounded-lg border border-border bg-surface p-4 text-sm leading-6 text-muted-foreground">
                        {item.name === "card"
                          ? "Interactive cards lift by 1px, increase elevation, soften the border toward primary, and compress to 99.5% on press. The beam variant adds a rotating conic border animation and disables it for reduced-motion users."
                          : item.name === "text"
                            ? "Glow adds a token-colored premium aura. Shimmer animates a tokenized gradient across the glyphs and falls back to static text for reduced-motion users."
                            : item.name === "switch"
                              ? "The thumb uses a spring-timed snap, stretches slightly on press, and the active track gains a subtle inset highlight. Motion is disabled for reduced-motion users."
                              : "Uses Brilliant tokens for focus, density, radius, and motion. Motion-bearing states are guarded with reduced-motion behavior in the generated source."}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Accessibility</h3>
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                      {item.metadata.accessibility.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })}

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="The shared system layer underneath components and blocks."
              id="foundations"
            >
              Foundations
            </SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              {foundations.map(([title, description]) => (
                <article className="rounded-lg border border-border bg-surface p-5" key={title}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="Higher-level systems that make Brilliant more than primitive wrappers."
              id="blocks"
            >
              Product systems
            </SectionHeading>
            <div className="grid gap-4">
              {premiumSystems.map(([title, description]) => (
                <article
                  className="rounded-lg border border-border bg-surface p-5 hover:border-primary/30"
                  key={title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{title}</h3>
                    <Badge>planned</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
            <div className="pt-2">
              <h3 className="text-lg font-semibold">Block families</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {blockGroups.map(([title, description]) => (
                <article className="rounded-lg border border-border bg-surface p-5" key={title}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{title}</h3>
                    <Badge>planned</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="The default indigo is only a starting point; production apps can own their brand."
              id="theming"
            >
              Brand theming
            </SectionHeading>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <CodeBlock>{`:root {
  --brilliant-primary: oklch(0.54 0.23 276);
  --brilliant-primary-foreground: oklch(1 0 0);
  --brilliant-ring: oklch(0.61 0.22 276);
}

[data-brand="acme"] {
  --brilliant-primary: oklch(0.62 0.18 145);
  --brilliant-ring: oklch(0.62 0.18 145);
}`}</CodeBlock>
              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="font-semibold">What changes?</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Buttons, focus rings, badges, charts, blocks, and future components inherit
                  semantic tokens instead of hardcoded colors.
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-20">
            <SectionHeading
              description="Initialize existing projects, map shadcn aliases, preview changes, and install copy-owned source."
              id="cli"
            >
              CLI
            </SectionHeading>
            <div className="rounded-lg border border-border bg-surface">
              <div className="border-b border-border px-4 py-3 text-sm font-medium">Demo</div>
              <div className="p-4">
                <CodeBlock>{`TMP_DEMO=$(mktemp -d)
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- init --cwd "$TMP_DEMO"
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- add button --cwd "$TMP_DEMO"
find "$TMP_DEMO" -maxdepth 4 -type f | sort`}</CodeBlock>
              </div>
            </div>
          </section>
        </div>

        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] border-l border-border px-6 py-6 xl:block">
          <div className="space-y-5 text-sm">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Status</p>
              <dl className="mt-3 space-y-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Complete</dt>
                  <dd className="font-medium">41</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Remaining</dt>
                  <dd className="font-medium">209</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Registry items</dt>
                  <dd className="font-medium">{registry.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Micro UX</dt>
                  <dd className="font-medium">built in</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="font-medium">Current component</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {firstItem?.title ?? "None"} is available from the local registry.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found.");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
