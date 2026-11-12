# @brilliantmode/ui

## 0.5.0

### Minor Changes

- Route every Brilliant UI link through the app's router. Add `LinkProvider` and `Link`: wrap the app once with your router's link component (for example the Next.js `Link`), and the Application Shell (brand, header brand, search, nav items, nav group items), Header, Footer, Breadcrumb, Pagination and Navigation Menu links navigate client-side instead of reloading the page. Without a provider they render plain anchors as before.
  
  Add `ButtonLink` and `buttonClassName` so navigation actions can look like buttons without nesting a button inside a link. Add `BreadcrumbLink` and `BreadcrumbPage`. Fix `NavigationMenuLink` and `PaginationLink` props to accept anchor attributes such as `href`.

## 0.4.0

### Minor Changes

- 3f2be61: Add Voice Orb with the original MIT-licensed Ship Notes renderer adapted for React, preserving its layered palette, luminous particle surface, illuminated thinking bands, and audio response. Includes caller-owned AnalyserNode support, normalized frequency bands, accessible motion controls, theme overrides, and static fallbacks. Retain the Ship Notes copyright and license, and credit Ship Notes / aqualang89 in both orb documentation pages.
- 3849c40: Add SignalOrb, a themeable React particle visualization with listening, thinking, searching, and done states. Includes pulse intensity, motion controls, reduced-motion support, visibility-aware rendering, an SVG fallback, and registry/MCP documentation. Independently implemented with inspiration credited to Ship Notes.

## 0.3.2

### Patch Changes

- Support decorative icons and logos in searchable Combobox options and selected values while preserving text labels, filtering, keyboard selection, and accessible names. Replace the docs-only combobox preview with the shipped component and document the new option icon slot.

## 0.3.1

### Patch Changes

- Provide pointer cursors by default for actionable controls, including buttons, menu items, tabs, navigation, and disclosure triggers. Keep disabled states from advertising a clickable cursor and retain native text-entry cursors.
- Support React 19 refs on Input, Textarea, Dialog, and AlertDialog. Keep Select and DropdownMenu portals within their containing native dialog so menus remain visible and interactive in the modal top layer. Route toast notifications to the active native modal and restore them when it closes or unmounts.

## 0.3.0

### Minor Changes

- c18bd0e: Add Card Flip and Card Expand behavior primitives with controlled and uncontrolled state, configurable motion speeds, accessible triggers, reduced-motion support, and polished Wallet-pass-style Card composition examples, including a card whose front and back can both expand.
- Add a responsive, accessible QR Code component with reliable quiet-zone and error-correction defaults.

### Patch Changes

- f0e3bf9: Show a thin, token-colored scrollbar when Application Shell sidebars, dropdown menus, selects, and combobox results exceed their available height.

## 0.2.0

### Minor Changes

- 369c683: Expand Application Shell with portal and kiosk variations, full header/footer composition, touch-oriented examples, theme-isolated interactive documentation, and synchronized AI guidance. Add the tokenized `glow`, `tactile`, `molded`, and `gel` button variants, a larger `kiosk` size, icon composition examples, and an accessible loading state. Improve generated Carousel, Photo Upload, and Status source correctness so package-wide release checks remain clean.
