import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function Playground() {
  const [dark, setDark] = useState(true);
  return (
    <div className={dark ? "dark" : ""}>
      <main className="min-h-screen bg-background p-8 text-foreground">
        <div className="mx-auto max-w-4xl">
          <header className="flex items-center justify-between border-b border-border pb-5">
            <div>
              <p className="text-xs text-muted-foreground">Brilliant UI</p>
              <h1 className="mt-1 text-xl font-semibold">Component playground</h1>
            </div>
            <button
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
              onClick={() => setDark((value) => !value)}
              type="button"
            >
              {dark ? "Light" : "Dark"} theme
            </button>
          </header>
          <section className="mt-12 rounded-xl border border-border bg-surface p-8 shadow-md">
            <p className="text-sm font-medium">Token preview</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              This isolated surface verifies semantic colors, typography, radius, elevation, focus,
              and theme behavior.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                type="button"
              >
                Primary action
              </button>
              <button
                className="rounded-md border border-border px-4 py-2 text-sm font-medium"
                type="button"
              >
                Secondary action
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found.");
createRoot(root).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);
