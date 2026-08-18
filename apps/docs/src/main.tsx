import { registry } from "@brilliant-ui/registry";
import { type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const status = [
  ["41", "roadmap items complete"],
  ["7", "workspace packages"],
  ["1", "copy-owned component"],
  ["209", "planned items left"],
] as const;

const foundations = [
  "Typed OKLCH semantic tokens",
  "Instrument Sans + IBM Plex Mono",
  "Light, dark, density, high-contrast contracts",
  "Registry validation, checksums, dependency resolution",
  "Existing shadcn components.json detection",
  "CI, Changesets, security and license gates",
] as const;

const blockGroups = [
  {
    title: "Application",
    items: ["App shell", "Dashboard layout", "Settings layout", "Auth layout", "Master detail"],
  },
  {
    title: "Data",
    items: ["Data table", "Audit explorer", "Usage meters", "Invoice list", "Charts"],
  },
  {
    title: "Forms",
    items: ["Field primitives", "File upload", "OTP input", "Wizard", "Filter builder"],
  },
  {
    title: "AI",
    items: ["Prompt input", "Chat thread", "Tool-call viewer", "Citations", "Agent status"],
  },
  {
    title: "SaaS",
    items: ["Billing overview", "API keys", "Webhooks", "Members", "Feature flags"],
  },
  {
    title: "Enterprise",
    items: ["Permission matrix", "Role editor", "Policy builder", "Org tree", "Access timeline"],
  },
] as const;

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ready";
}) {
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

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav
        className="sticky top-0 z-20 border-b border-border bg-background/92 backdrop-blur"
        aria-label="Main"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <a className="text-sm font-semibold" href="/">
            Brilliant UI
          </a>
          <div className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#catalog">Catalog</a>
            <a href="#blocks">Blocks</a>
            <a href="#install">Install</a>
          </div>
          <Badge tone="ready">Phase 2 foundation</Badge>
        </div>
      </nav>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge tone="ready">Registry</Badge>
              <Badge tone="ready">Themes</Badge>
              <Badge tone="ready">CLI</Badge>
              <Badge>Blocks in progress</Badge>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              The Brilliant UI catalog starts here.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              This site now shows the actual package surface: shipped source components, token and
              theme foundations, install commands, and the block roadmap.
            </p>
          </div>

          <div className="grid grid-cols-2 border border-border bg-background">
            {status.map(([value, label]) => (
              <div
                className="border-b border-r border-border p-5 even:border-r-0 nth-[n+3]:border-b-0"
                key={label}
              >
                <div className="text-3xl font-semibold">{value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10" id="catalog">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Available Now</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These are implemented, tested, and installable from the local registry.
            </p>
          </div>
          <code className="hidden border border-border bg-surface px-3 py-2 text-xs md:block">
            brilliant-ui add button
          </code>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-border bg-surface">
            {registry.map((item) => (
              <article className="border-b border-border p-5 last:border-b-0" key={item.name}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
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

          <div className="border border-border bg-background p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Button preview</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Semantic variants using Brilliant tokens.
                </p>
              </div>
              <Badge tone="ready">copy-owned</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
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
                Invite member
              </button>
              <button
                className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium"
                type="button"
              >
                View audit
              </button>
              <button
                className="inline-flex h-9 items-center justify-center rounded-md bg-critical px-4 text-sm font-medium text-critical-foreground"
                type="button"
              >
                Revoke key
              </button>
            </div>
            <pre className="mt-6 overflow-auto border border-border bg-surface p-4 text-xs leading-6 text-muted-foreground">
              <code>{registry[0]?.files[0]?.content.slice(0, 760)}...</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold">Foundation</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The system pieces are ready enough to support component delivery without repainting
              the whole house later.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {foundations.map((item) => (
              <div className="border border-border bg-background p-4 text-sm" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10" id="blocks">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Block Catalog</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Planned product blocks are visible here now; they flip to available as packages land.
            </p>
          </div>
          <Badge>planned</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blockGroups.map((group) => (
            <article className="border border-border bg-surface" key={group.title}>
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="font-semibold">{group.title}</h3>
                <Badge>queued</Badge>
              </div>
              <div className="divide-y divide-border">
                {group.items.map((item) => (
                  <div className="flex items-center justify-between px-4 py-3 text-sm" key={item}>
                    <span>{item}</span>
                    <span className="text-xs text-muted-foreground">Phase 3+</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface" id="install">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Demo Script</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use this to show init, existing-project-safe config, and copy-owned source install.
            </p>
          </div>
          <pre className="overflow-auto border border-border bg-background p-4 text-xs leading-6">
            <code>{`TMP_DEMO=$(mktemp -d)
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- init --cwd "$TMP_DEMO"
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- add button --cwd "$TMP_DEMO"
find "$TMP_DEMO" -maxdepth 4 -type f | sort`}</code>
          </pre>
        </div>
      </section>
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
