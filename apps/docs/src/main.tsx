import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const principles = [
  ["Own the source", "Copyable components remain understandable and adaptable."],
  [
    "Accessible by default",
    "Keyboard, screen reader, and reduced-motion behavior are foundational.",
  ],
  ["One visual language", "Shared semantic tokens keep every product surface coherent."],
] as const;

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
        aria-label="Main"
      >
        <a className="text-sm font-semibold tracking-tight" href="/">
          Brilliant UI
        </a>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          Phase 1
        </span>
      </nav>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 md:pt-36">
        <p className="mb-5 text-sm font-medium text-primary">The UI operating system for React</p>
        <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
          Build the product. Not the component stack.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
          A calm, cohesive foundation for enterprise software, AI products, and modern SaaS—built on
          the open-source tools you already trust.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <code className="rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-sm">
            npx brilliant-ui init
          </code>
          <a
            className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
            href="#principles"
          >
            Explore the foundation
          </a>
        </div>
      </section>
      <section className="border-y border-border bg-surface" id="principles">
        <div className="mx-auto grid max-w-6xl md:grid-cols-3">
          {principles.map(([title, description]) => (
            <article
              className="border-b border-border px-6 py-10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              key={title}
            >
              <h2 className="font-medium">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
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
