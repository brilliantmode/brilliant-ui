import { registry } from "@brilliant-ui/registry";
import { type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const navItems = [
  ["Getting Started", "#getting-started"],
  ["Components", "#components"],
  ["Button", "#button"],
  ["Foundations", "#foundations"],
  ["Blocks", "#blocks"],
  ["CLI", "#cli"],
] as const;

const buttonVariants = [
  [
    "Default",
    "Save changes",
    "border border-foreground bg-foreground text-background shadow-sm hover:bg-foreground/92 active:bg-foreground/88",
  ],
  [
    "Secondary",
    "Secondary",
    "border border-border bg-surface text-foreground shadow-sm hover:border-foreground/40 hover:bg-muted active:bg-secondary",
  ],
  [
    "Outline",
    "Outline",
    "border border-border bg-background text-foreground hover:border-foreground/50 hover:bg-muted active:bg-secondary",
  ],
  [
    "Ghost",
    "Ghost",
    "border border-transparent text-foreground hover:bg-muted active:bg-secondary",
  ],
  [
    "Critical",
    "Delete",
    "border border-critical bg-critical text-critical-foreground shadow-sm hover:bg-critical/92 active:bg-critical/88",
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
  ["Tokens", "OKLCH color, spacing, radius, elevation, typography, motion, and density tokens."],
  ["Themes", "Light, dark, system preference, high-contrast, and brand override contracts."],
  ["Micro UX", "Reusable press, lift, reveal, focus, loading, and reduced-motion primitives."],
  ["Registry", "Versioned items with metadata, dependency resolution, checksums, and safe paths."],
  ["CLI", "Project init, shadcn alias mapping, dry runs, forced updates, and manifests."],
] as const;

const blockGroups = [
  ["Application", "App shell, dashboard, settings, authentication, master detail"],
  ["Data", "Tables, audit explorer, usage meters, invoices, charts"],
  ["Forms", "Fields, upload, OTP, wizard, filters, schema renderer"],
  ["AI", "Prompt input, chat thread, tool calls, citations, agent status"],
  ["SaaS", "Billing, API keys, webhooks, members, feature flags"],
  ["Enterprise", "Permissions, roles, policies, org tree, access timeline"],
] as const;

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
        "relative isolate inline-flex shrink-0 items-center justify-center gap-2 rounded-[0.25rem] font-medium tracking-[-0.005em]",
        "motion-safe:transition-[color,background-color,border-color,box-shadow,opacity] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

function App() {
  const firstItem = registry[0];

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
                className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
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
            <Badge tone="ready">React source components</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
              Build with copy-owned components and production tokens.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Brilliant UI follows the familiar UI framework docs pattern: install the CLI, add
              source components, customize them in your app, and rely on shared tokens and registry
              metadata underneath.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                href="#cli"
              >
                Get started
              </a>
              <a
                className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium"
                href="#components"
              >
                Browse components
              </a>
            </div>
            <div className="mt-8">
              <CodeBlock>{`pnpm --filter @brilliant-ui/cli dev -- init
pnpm --filter @brilliant-ui/cli dev -- add button`}</CodeBlock>
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="Implemented registry items that can be installed into an app today."
              id="components"
            >
              Components
            </SectionHeading>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {registry.map((item) => (
                <a
                  className="rounded-lg border border-border bg-surface p-5 hover:border-primary/30"
                  href={`#${item.name}`}
                  key={item.name}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge tone="ready">available</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </a>
              ))}
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
                forms, dialogs, toolbars, and application screens.
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
              </ul>
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
              description="Planned higher-level product blocks. These stay marked planned until implementation lands."
              id="blocks"
            >
              Blocks
            </SectionHeading>
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
