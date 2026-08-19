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
  ["Badge", "#badge"],
  ["Card", "#card"],
  ["Input", "#input"],
  ["Label", "#label"],
  ["Textarea", "#textarea"],
  ["Checkbox", "#checkbox"],
  ["Switch", "#switch"],
  ["Alert", "#alert"],
  ["Separator", "#separator"],
  ["Skeleton", "#skeleton"],
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
  badge: `import { Badge } from "@/components/ui/badge";

export function Example() {
  return <Badge variant="primary">Live</Badge>;
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
    <Card beam={isProcessing} interactive>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Current billing period</CardDescription>
      </CardHeader>
      <CardContent>2.4M events</CardContent>
    </Card>
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
  return <Checkbox aria-label="Require approval" defaultChecked />;
}`,
  switch: `import { Switch } from "@/components/ui/switch";

export function Example() {
  return <Switch aria-label="Enable sync" defaultChecked />;
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
  return <Separator />;
}`,
  skeleton: `import { Skeleton } from "@/components/ui/skeleton";

export function Example() {
  return <Skeleton className="h-4 w-48" />;
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

function ComponentMiniPreview({ name }: { name: string }) {
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
      <label className="flex items-center gap-2 text-sm">
        <input
          className="size-4 accent-[var(--brilliant-primary)]"
          defaultChecked
          type="checkbox"
        />
        Require approval
      </label>
    );
  }

  if (name === "switch") {
    return (
      <div className="flex items-center gap-3">
        <span className="h-5 w-9 rounded-full bg-primary p-0.5">
          <span className="block size-4 translate-x-4 rounded-full bg-surface shadow-sm" />
        </span>
        <span className="text-sm">Enabled</span>
      </div>
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
        <div className="h-px w-full bg-border" />
        <p className="text-muted-foreground">Billing</p>
      </div>
    );
  }

  if (name === "skeleton") {
    return (
      <div className="space-y-2">
        <div className="h-4 w-2/3 rounded-[0.25rem] bg-muted" />
        <div className="h-4 w-full rounded-[0.25rem] bg-muted" />
        <div className="h-4 w-1/2 rounded-[0.25rem] bg-muted" />
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
          <a className="text-sm font-semibold tracking-tight" href="/">
            Brilliant UI
          </a>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            {navItems.slice(1).map(([label, href]) => (
              <a className="hover:text-foreground" href={href} key={href}>
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
  return <Button>Save changes</Button>;
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

                  {item.name === "card" ? (
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
                            {[
                              ["surface", "Default content grouping."],
                              ["elevated", "Raised dashboard or summary surfaces."],
                              ["accent", "Selected, highlighted, or recommended content."],
                              ["beam", "Premium live, AI, processing, or highlighted states."],
                              ["muted", "Low-emphasis grouping inside denser layouts."],
                              ["ghost", "Structure without a visible panel."],
                            ].map(([variant, use]) => (
                              <tr className="border-b border-border last:border-b-0" key={variant}>
                                <td className="px-4 py-3 font-mono text-xs">{variant}</td>
                                <td className="px-4 py-3 text-muted-foreground">{use}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Set <code>interactive</code> to add hover lift, elevation, and press
                        feedback for clickable card targets. Set <code>beam=&#123;state&#125;</code>{" "}
                        when a card should enter the premium live/processing state from app state.
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
