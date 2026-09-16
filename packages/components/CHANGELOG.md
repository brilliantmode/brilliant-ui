# @brilliantmode/ui

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
