# Architecture

## Package boundaries

Dependencies flow inward. Product-facing packages may depend on foundation packages; foundation
packages never depend on product-facing packages.

```text
apps/docs ─────────────┐
apps/playground ───────┼──> components (Phase 3) ──> core ──> tokens
cli ──> registry ──────┘
```

The registry distributes source code rather than hiding it behind a runtime dependency. This
preserves shadcn/ui compatibility and gives application teams ownership of installed components.

## Public API policy

- A package exposes only paths declared in its `exports` map.
- Components are named exports; default exports are reserved for framework-required app files.
- Browser-safe packages contain no Node.js imports.
- Shared contracts are readonly where possible.
- Breaking public API changes require a changeset once releases begin.

## Tokens

Token names describe intent (`surface`, `foreground`, `critical`) rather than a fixed pigment.
Primitive scales live in TypeScript; semantic light/dark themes are CSS variables. Tailwind v4
consumes the same variables via `@theme inline`, so component and utility APIs cannot drift.

## Registry

Every item includes a kind, dependencies, files, accessibility guidance, examples, and AI-facing
composition hints. Registry validation happens before publication. The CLI resolves registry
items, checks conflicts, and writes owned source into a consumer application.

## Roadmap boundaries

- Phase 1: monorepo, tooling, CLI, tokens.
- Phase 2: theme engine, remote registry publication, shadcn import adapter.
- Phase 3: foundation components, forms, navigation, layouts.
- Phase 4: enterprise, SaaS, and AI component suites.
- Phase 5: production blocks, templates, comprehensive docs.
- Phase 6: performance budgets, accessibility audit, release hardening.
