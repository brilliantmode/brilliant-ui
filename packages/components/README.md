# @brilliant/ui

Enterprise-ready React components with brandable tokens and built-in micro UX. Brilliant UI ships
components, styles, design tokens, and animation utilities as one package.

## Maintenance and support

`@brilliant/ui` is an official Brilliant package developed primarily for Brilliant-owned products.
It is publicly available for broader use, but public availability does not include external
support, compatibility guarantees, feature commitments, or a guaranteed release schedule.
Development follows Brilliant's internal priorities, and APIs may change during `0.x` releases.
External adopters should evaluate and pin versions appropriate to their own requirements.

## Requirements

- React 19.1 or newer
- Tailwind CSS v4
- Node.js 20 or newer for development and server-side tooling

## Install

```sh
pnpm add @brilliant/ui tailwindcss
```

Add Brilliant UI to your global stylesheet after Tailwind:

```css
@import "tailwindcss";
@import "@brilliant/ui/styles.css";
```

Import components through their subpaths:

```tsx
import { Button } from "@brilliant/ui/button";

export function SaveButton() {
  return <Button>Save changes</Button>;
}
```

Tokens and animation utilities are included in the same installation:

```ts
import { animationPresets, microUx } from "@brilliant/ui/animations";
import { tokens } from "@brilliant/ui/tokens";
```

## AI coding with MCP

The package includes an optional, user-initiated MCP server over stdio. It exposes the installed
version's component catalog, TypeScript declarations, copy-ready usage examples, accessibility
guidance, installation instructions, design tokens, and application-level guides for theming,
composition, forms, overlays, dashboards, accessibility, troubleshooting, and upgrades. Tool
results include both structured data and text JSON for compatibility with current and older MCP
clients. Installing the package does not start the server.

Configure an MCP client from the application where `@brilliant/ui` is installed:

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

The MCP client launches and owns the stdio process after the user enables this configuration.
The package also runs a clean-consumer smoke test before release to verify that the packed binary,
tool discovery, structured component and guide results, and resources work outside this monorepo.

AI clients can discover the documentation with `search_guides`, retrieve full Markdown with
`get_guide`, or read `brilliant://guides/{slug}` resources. Component-specific API documentation
remains available through `get_component` and `brilliant://components/{name}`. Component
suggestions use local whole-word, intent-aware scoring and include the matched terms and reason;
negative `avoid` guidance reduces relevance instead of accidentally promoting a component.

Override semantic variables after importing the package stylesheet:

```css
:root {
  --brilliant-primary: oklch(0.54 0.23 276);
  --brilliant-ring: oklch(0.61 0.22 276);
  --brilliant-radius: 0.625rem;
}
```

## License

MIT
