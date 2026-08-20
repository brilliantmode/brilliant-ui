/* Generated from the Brilliant UI documentation registry. Do not edit directly. */
export const documentationGuides = [
  {
    slug: "getting-started",
    title: "Getting started",
    summary: "Install Brilliant UI, load its Tailwind stylesheet, and render the first component.",
    topics: ["installation", "tailwind", "imports", "mcp"],
    content:
      '# Getting started\n\nBrilliant UI requires React 19.1 or newer, Tailwind CSS v4, and Node.js 20 or newer for tooling.\n\n## Install\n\n```bash\npnpm add @brilliant/ui tailwindcss\n```\n\n## Load the global stylesheet\n\nAdd these imports once in the application\'s global CSS file:\n\n```css\n@import "tailwindcss";\n@import "@brilliant/ui/styles.css";\n```\n\n## Import a component\n\nUse component subpaths so bundlers include only what the application imports:\n\n```tsx\nimport { Button } from "@brilliant/ui/button";\n\nexport function SaveButton() {\n  return <Button>Save changes</Button>;\n}\n```\n\nFor AI-authored interfaces, search the catalog first and retrieve each selected component before writing code. The component result contains the exact import, API declaration, accessibility notes, and a version-matched example.',
  },
  {
    slug: "theming",
    title: "Theming and design tokens",
    summary:
      "Brand an application through semantic CSS variables and version-matched token groups.",
    topics: ["theming", "tokens", "css", "dark-mode", "branding"],
    content:
      "# Theming and design tokens\n\nBrilliant UI components consume semantic Tailwind classes such as `bg-primary`, `text-primary-foreground`, `border-border`, and `ring-ring`. Customize the semantic variables instead of editing every component.\n\nOverride variables after importing the Brilliant stylesheet:\n\n```css\n:root {\n  --brilliant-primary: oklch(0.54 0.23 276);\n  --brilliant-ring: oklch(0.61 0.22 276);\n  --brilliant-radius: 0.625rem;\n}\n```\n\nUse `get_design_tokens` before generating token-dependent code. Available groups cover semantic and primitive colors, spacing, typography, radii, elevation, density, motion, opacity, border width, breakpoints, and z-index.\n\nKeep product colors semantic. Do not replace component classes with hard-coded palette values, and preserve sufficient contrast in every appearance.",
  },
  {
    slug: "component-composition",
    title: "Component composition",
    summary:
      "Choose primitives, layouts, and blocks without inventing unsupported Brilliant UI APIs.",
    topics: ["components", "composition", "layouts", "blocks", "imports"],
    content:
      "# Component composition\n\nUse `search_components` for known concepts and `suggest_components` for an interface description. Then call `get_component` for every chosen item before implementing it.\n\nPrefer the smallest appropriate layer:\n\n- Components are focused controls and surfaces such as Button, Field, Dialog, Table, and Tabs.\n- Layouts provide page structure such as Application Shell and Dashboard Layout.\n- Blocks combine primitives for a specific workflow, such as Analytics Overview Dashboard or Onboarding Wizard.\n\nImport each item from the exact subpath returned by the MCP. Do not infer props from another design system, and do not import internal generated files.\n\nKeep one primary action per region, use semantic HTML around the components, and preserve the component's documented slots and interaction states when composing larger interfaces.",
  },
  {
    slug: "forms-and-validation",
    title: "Forms and validation",
    summary:
      "Compose labeled, accessible form controls with clear help, error, and submission states.",
    topics: ["forms", "validation", "input", "field", "accessibility"],
    content:
      "# Forms and validation\n\nBuild forms from native-first Brilliant controls such as Field, Label, Input, Textarea, Select, Checkbox, Switch, Radio Group, Slider, Date Input, File Upload, and Photo Upload.\n\nFor each field:\n\n- Provide a visible label and stable control identifier.\n- Connect help and error text with the appropriate ARIA description attributes.\n- Set native invalid and disabled state as well as visual state.\n- Keep validation messages specific and place them next to the affected field.\n- Preserve entered values after a failed submission.\n\nUse Button for submission actions and expose loading without removing the action label. Retrieve every form component before coding because exact props and composition differ by primitive.",
  },
  {
    slug: "overlays-and-feedback",
    title: "Overlays and feedback",
    summary:
      "Select dialogs, drawers, menus, hints, alerts, and transient feedback by interaction risk.",
    topics: ["dialog", "drawer", "menu", "tooltip", "toast", "feedback"],
    content:
      "# Overlays and feedback\n\nChoose the surface according to the interaction:\n\n- Dialog: focused modal work with a clear completion or dismissal path.\n- Alert Dialog: destructive or high-risk confirmation.\n- Drawer or Sheet: secondary workflows, filters, and settings.\n- Dropdown Menu or Context Menu: compact secondary actions.\n- Popover or Hover Card: contextual content that does not require a full modal.\n- Tooltip: a short hint, never essential instructions.\n- Alert: persistent status or guidance; Toast: transient confirmation.\n\nDo not nest modal surfaces. Keep destructive actions explicit, return focus when an overlay closes, and ensure every icon-only trigger has an accessible name. Retrieve the selected component for its exact structure and keyboard behavior.",
  },
  {
    slug: "accessibility-and-motion",
    title: "Accessibility and motion",
    summary:
      "Preserve native semantics, keyboard operation, visible focus, and reduced-motion behavior.",
    topics: ["accessibility", "keyboard", "focus", "motion", "aria"],
    content:
      "# Accessibility and motion\n\nTreat the accessibility array returned by `get_component` as implementation requirements, not optional suggestions.\n\nGeneral rules:\n\n- Prefer native controls and landmarks whenever they express the interaction.\n- Preserve visible focus and logical keyboard order.\n- Give icon-only controls an accessible name.\n- Associate labels, descriptions, validation messages, and status updates programmatically.\n- Do not communicate state through color alone.\n- Preserve `motion-safe` and `motion-reduce` behavior in motion-bearing components.\n\nWhen composing multiple primitives, test keyboard entry, operation, dismissal, focus restoration, screen-reader naming, zoom, contrast, and reduced-motion preferences.",
  },
  {
    slug: "dashboards-and-data",
    title: "Dashboards and data display",
    summary:
      "Compose readable enterprise dashboards from metrics, status, charts, tables, and layouts.",
    topics: ["dashboard", "chart", "table", "metrics", "status", "responsive"],
    content:
      "# Dashboards and data display\n\nUse Dashboard Layout or Application Shell for structure, then compose Stat, Status, Meter, Chart, Table, Progress, and Empty State according to the data's meaning.\n\nKeep the hierarchy restrained:\n\n- Put the decision-driving metric first.\n- Pair trends with a time window and comparison basis.\n- Label chart series and units; do not rely on color alone.\n- Use tables when exact comparison matters and charts when shape or trend matters.\n- Provide loading, empty, error, and stale-data states.\n- Keep dense controls keyboard reachable and usable at narrow widths.\n\nStart from a dashboard block only when its workflow matches the request. Otherwise compose primitives and retrieve each API before implementation.",
  },
  {
    slug: "troubleshooting-and-upgrades",
    title: "Troubleshooting and upgrades",
    summary: "Diagnose missing styles, import failures, MCP startup issues, and package upgrades.",
    topics: ["troubleshooting", "upgrade", "mcp", "styles", "imports"],
    content:
      "# Troubleshooting and upgrades\n\n## Components render without Brilliant styling\n\nConfirm the global stylesheet imports Tailwind first and `@brilliant/ui/styles.css` second. Ensure the CSS file is loaded by the application entry point.\n\n## A component import fails\n\nUse the exact `importPath` returned by `get_component`. Do not guess a barrel export or import from `dist` or `src` internals.\n\n## The MCP process exits or exposes no tools\n\nRun the MCP command from a project where `@brilliant/ui` is installed. The client must launch `pnpm exec brilliant-ui-mcp` over stdio; the command is expected to remain silent while waiting for protocol messages. Restart the MCP connection after changing its configuration or upgrading the package.\n\n## Upgrade\n\nRun `pnpm up @brilliant/ui`, review release notes, restart the MCP connection, and retrieve component documentation again so generated code matches the installed version.",
  },
] as const;
