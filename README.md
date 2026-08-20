# Brilliant UI

Brilliant UI is an opinionated, open-source UI operating system for React. It packages
shadcn-compatible conventions behind stable, upgradeable imports while standardizing tokens,
themes, accessible primitives, application blocks, and tooling for production software.

## Status

Brilliant UI is moving from **Phase 1: foundation** into **Phase 2: core infrastructure**. The
current workspace establishes the monorepo, strict TypeScript policy, design-token pipeline,
theme contracts, registry contract, and optional MCP integration. APIs may change before the first
stable release.

## Maintenance and support

Brilliant UI is an official Brilliant project developed primarily for Brilliant-owned products.
The source and `@brilliant/ui` package are publicly available for broader use, but public
availability does not include external support, compatibility guarantees, feature commitments, or
a guaranteed release schedule. Development follows Brilliant's internal priorities, and APIs may
change during `0.x` releases. External adopters should evaluate and pin versions appropriate to
their own requirements.

## Quick start

```sh
pnpm install
pnpm build
```

Consumer applications install the protected package and import only what they use:

```sh
pnpm add @brilliant/ui tailwindcss
```

Add the package stylesheet to your global CSS after Tailwind:

```css
@import "tailwindcss";
@import "@brilliant/ui/styles.css";
```

```tsx
import { Button } from "@brilliant/ui/button";
```

Tokens and animation utilities are included in the same installation:

```ts
import { animationPresets } from "@brilliant/ui/animations";
import { tokens } from "@brilliant/ui/tokens";
```

For AI coding tools, the same package includes a user-initiated stdio MCP server:

```json
{
  "mcpServers": {
    "brilliant-ui": {
      "command": "pnpm",
      "args": ["exec", "brilliant-ui-mcp"]
    }
  }
}
```

## Public package

| Package | Purpose |
| --- | --- |
| `@brilliant/ui` | Protected, tree-shakeable components, layouts, blocks, styles, and shared conventions |

All `@brilliant-ui/*` workspaces are private implementation modules used to build and document the
single public package. Consumers never need to install them.

## Typography

Brilliant UI uses Instrument Sans for interface typography and IBM Plex Mono for code, identifiers,
and technical data. The package declares these families but does not bundle font files into consumer
applications. Self-host them, load them through your application framework, or install
`@fontsource-variable/instrument-sans` and `@fontsource/ibm-plex-mono`.

Read [ARCHITECTURE.md](./ARCHITECTURE.md) for package boundaries and design decisions. The
version-controlled implementation backlog lives in [ROADMAP.md](./ROADMAP.md).

## Foundation Dependencies

The workspace is now wired for the shadcn-compatible stack: Radix primitives, Class Variance
Authority, `clsx`, `tailwind-merge`, Lucide, Motion, React Hook Form, Zod, TanStack Table, and the
official `shadcn` CLI package are available through the pnpm catalog for the packages that need
them.

## Principles

- Compatible with shadcn/ui conventions through a protected, versioned package API.
- Tailwind CSS v4, CSS variables, OKLCH color, and tokens at every layer.
- Radix UI and ARIA patterns for accessible primitives.
- React Hook Form + Zod and TanStack defaults for higher-level packages.
- Strict TypeScript, no `any`, tree-shakeable modules, and minimal runtime.

## License

MIT
