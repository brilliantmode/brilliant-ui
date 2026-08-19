import { registry } from "@brilliant-ui/registry";
import { type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const navItems = [
  ["Getting Started", "#getting-started"],
  ["Components", "#components"],
  ["Foundations", "#foundations"],
  ["Blocks", "#blocks"],
  ["CLI", "#cli"],
] as const;

const foundations = [
  ["Tokens", "OKLCH color, spacing, radius, elevation, typography, motion, and density tokens."],
  ["Themes", "Light, dark, system preference, high-contrast, and brand override contracts."],
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
            <pre className="mt-8 overflow-auto rounded-lg border border-border bg-surface p-4 text-sm">
              <code>{`pnpm --filter @brilliant-ui/cli dev -- init
pnpm --filter @brilliant-ui/cli dev -- add button`}</code>
            </pre>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="Implemented registry items that can be installed into an app today."
              id="components"
            >
              Components
            </SectionHeading>

            <div className="grid gap-4 sm:grid-cols-2">
              {registry.map((item) => (
                <article className="rounded-lg border border-border bg-surface p-5" key={item.name}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge tone="ready">{item.kind}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.metadata.slots.map((slot) => (
                      <Badge key={slot}>{slot}</Badge>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">Button</h3>
                <Badge tone="ready">preview</Badge>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                  type="button"
                >
                  Save changes
                </button>
                <button
                  className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground"
                  type="button"
                >
                  Secondary
                </button>
                <button
                  className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium"
                  type="button"
                >
                  Outline
                </button>
                <button
                  className="inline-flex h-9 items-center justify-center rounded-md bg-critical px-4 text-sm font-medium text-critical-foreground"
                  type="button"
                >
                  Critical
                </button>
              </div>
            </div>
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
              <pre className="overflow-auto p-4 text-sm leading-6">
                <code>{`TMP_DEMO=$(mktemp -d)
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- init --cwd "$TMP_DEMO"
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- add button --cwd "$TMP_DEMO"
find "$TMP_DEMO" -maxdepth 4 -type f | sort`}</code>
              </pre>
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
