# @brilliant/ui

Enterprise-ready React components with brandable tokens and built-in micro UX. Brilliant UI ships
components, styles, design tokens, and animation utilities as one package.

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
version's component catalog, TypeScript declarations, usage guidance, installation instructions,
and design tokens. Installing the package does not start the server.

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
