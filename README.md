# Brilliant UI

Brilliant UI is an opinionated, open-source UI operating system for React. It keeps the
copy-paste ownership model and conventions of shadcn/ui while standardizing tokens, themes,
accessible primitives, application blocks, and tooling for production software.

## Status

Brilliant UI is moving from **Phase 1: foundation** into **Phase 2: core infrastructure**. The
current workspace establishes the monorepo, strict TypeScript policy, design-token pipeline,
theme contracts, registry contract, and CLI. APIs may change before the first stable release.

## Quick start

```sh
pnpm install
pnpm build
pnpm --filter @brilliant-ui/cli dev -- init
```

CLI commands accept `--cwd`, `--force`, `--dry-run`, `--yes`, and `--silent` for scripted installs.

## Workspace

| Package | Purpose |
| --- | --- |
| `@brilliant-ui/tokens` | Typed tokens and Tailwind v4-compatible CSS variables |
| `@brilliant-ui/themes` | Typed theme contracts, brand overrides, and SSR-safe theme helpers |
| `@brilliant-ui/core` | Shared type-safe utilities and configuration contracts |
| `@brilliant-ui/registry` | Machine-readable component registry and AI metadata |
| `@brilliant-ui/cli` | `brilliant-ui init`, `add`, and `update` commands |
| `@brilliant-ui/docs` | Documentation application shell |
| `@brilliant-ui/playground` | Component development application shell |

## Typography

Brilliant UI uses Instrument Sans for interface typography and IBM Plex Mono for code, identifiers,
and technical data. The token package declares these families but does not bundle font files into
consumer applications. Self-host them, load them through your application framework, or install
`@fontsource-variable/instrument-sans` and `@fontsource/ibm-plex-mono`.

Read [ARCHITECTURE.md](./ARCHITECTURE.md) for package boundaries and design decisions. The
version-controlled implementation backlog lives in [ROADMAP.md](./ROADMAP.md).

## Principles

- Compatible with shadcn/ui conventions and copyable source ownership.
- Tailwind CSS v4, CSS variables, OKLCH color, and tokens at every layer.
- Radix UI and ARIA patterns for accessible primitives.
- React Hook Form + Zod and TanStack defaults for higher-level packages.
- Strict TypeScript, no `any`, tree-shakeable modules, and minimal runtime.

## License

MIT
