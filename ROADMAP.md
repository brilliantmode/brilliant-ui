# Brilliant UI Roadmap

This is the canonical delivery plan for Brilliant UI. The master specification defines the vision;
this document turns it into testable, reviewable work.

## How to use this roadmap

- Complete phases in order. Work within a phase may run in parallel only when its dependencies are
  satisfied.
- A checked task means its implementation, tests, accessibility notes, metadata, and documentation
  are complete—not merely that a file exists.
- Public APIs remain experimental until the Phase 6 release gate.
- Every new component must meet the shared definition of done below.

## Shared definition of done

Every public component, block, or package must satisfy all applicable requirements:

- [ ] Strict TypeScript with no `any` and no unexplained type assertions.
- [ ] Named, tree-shakeable exports and an explicit package `exports` map.
- [ ] Semantic tokens only; no hardcoded product colors, radius, shadows, or motion values.
- [ ] Keyboard behavior and accessible naming documented and tested.
- [ ] WCAG AA contrast in every bundled theme and interaction state.
- [ ] Reduced-motion behavior for every animation.
- [ ] Unit tests for behavior and edge cases.
- [ ] Automated accessibility test.
- [ ] Story or isolated playground fixture for every variant and state.
- [ ] Visual regression coverage in light and dark themes.
- [ ] Purpose, props, slots, variants, dependencies, examples, and AI composition metadata.
- [ ] Performance notes, including bundle impact and client/runtime boundaries.
- [ ] Documentation with purpose, examples, variants, do/don't guidance, and best practices.

## Phase 1 — Foundation

Goal: establish a dependable workspace, tooling contract, CLI skeleton, and token source of truth.

### Workspace and tooling

- [x] Create pnpm workspace and Turborepo task graph.
- [x] Add strict shared TypeScript configuration.
- [x] Add Biome formatting and linting.
- [x] Add Vitest and a repository-wide verification command.
- [x] Establish package boundaries and public API policy.
- [x] Add documentation and playground application shells.
- [ ] Add Changesets for versioning and release notes.
- [ ] Add GitHub Actions for lint, typecheck, tests, and builds.
- [ ] Add dependency review, license checking, and secret scanning.
- [ ] Add contribution templates, code of conduct, and security policy.

### Design tokens

- [x] Add typed color, radius, spacing, typography, elevation, motion, breakpoint, z-index, opacity,
      and border tokens.
- [x] Use OKLCH semantic light and dark color variables.
- [x] Map semantic variables into Tailwind CSS v4.
- [x] Add reduced-motion defaults.
- [x] Establish Instrument Sans and IBM Plex Mono typography.
- [ ] Generate CSS, TypeScript, and JSON artifacts from one token source.
- [ ] Add token schema validation and snapshot tests.
- [ ] Define density modes and high-contrast token contracts.

### CLI and registry skeleton

- [x] Implement `init`, `add`, and `update` commands.
- [x] Add conflict protection and an installation manifest.
- [x] Define registry item and AI metadata contracts.
- [x] Add an initial copy-owned button item.
- [ ] Reserve and finalize npm package names.
- [ ] Add changeset-aware CLI version reporting.

### Phase 1 exit gate

- [x] Repository-wide lint, typecheck, tests, and production builds pass.
- [x] The docs and playground can run locally.
- [x] A generated registry component can be installed into a temporary project.
- [ ] Continuous integration passes from a clean checkout.

## Phase 2 — Core infrastructure

Goal: make themes, the registry, and shadcn compatibility reliable enough for component delivery.

### Theme engine

- [ ] Create `@brilliant-ui/themes` with typed semantic theme contracts.
- [ ] Add system, light, dark, and explicit theme selection.
- [ ] Add SSR-safe theme initialization without a flash of incorrect theme.
- [ ] Add theme persistence and cross-tab synchronization.
- [ ] Add tenant/brand theme overrides with validation.
- [ ] Add density modes: comfortable, compact, and touch.
- [ ] Add forced-colors and high-contrast behavior.
- [ ] Document Next.js and Vite integration.

### Token pipeline

- [ ] Move primitive and semantic tokens into a validated source format.
- [ ] Generate TypeScript, CSS variables, Tailwind mappings, and JSON metadata.
- [ ] Detect missing semantic tokens across light and dark themes.
- [ ] Add automated contrast validation for interactive states.
- [ ] Publish token artifacts without application/runtime dependencies.

### Registry service

- [ ] Define a versioned JSON schema for registries and items.
- [ ] Validate registry items during build and publication.
- [ ] Generate the registry index and per-item JSON artifacts.
- [ ] Support components, blocks, templates, themes, layouts, and animations.
- [ ] Resolve transitive registry dependencies deterministically.
- [ ] Verify file checksums and reject path traversal.
- [ ] Add local, remote, and authenticated registry adapters.
- [ ] Publish a static registry from the documentation application.
- [ ] Add registry contract and fixture tests.

### shadcn/ui compatibility

- [ ] Read and map existing `components.json` configuration.
- [ ] Import official shadcn registry items without source modification.
- [ ] Preserve shadcn aliases, CSS variables, and file placement conventions.
- [ ] Add a compatibility test fixture for supported Next.js and Vite projects.
- [ ] Document how Brilliant UI extends rather than forks shadcn/ui.

### CLI productionization

- [ ] Detect framework, source directory, TypeScript, Tailwind, and aliases.
- [ ] Add interactive and non-interactive initialization.
- [ ] Install required dependencies through npm, pnpm, yarn, or Bun.
- [ ] Show a dry-run diff before overwriting files.
- [ ] Add `--cwd`, `--yes`, `--dry-run`, `--force`, and `--silent` flags.
- [ ] Add structured errors, exit codes, telemetry policy, and debug logging.
- [ ] Add end-to-end fixtures for Next.js and Vite.
- [ ] Publish a prerelease CLI package.

### Phase 2 exit gate

- [ ] A clean Next.js or Vite project can initialize and install a registry item with one command.
- [ ] Existing shadcn projects remain functional after Brilliant UI initialization.
- [ ] Theme selection is SSR-safe and passes contrast validation.
- [ ] Registry schemas and CLI workflows have end-to-end tests.

## Phase 3 — Product foundations

Goal: ship the accessible primitives, forms, navigation, and layouts required to build real apps.

### Component infrastructure

- [ ] Create `@brilliant-ui/components` with copy-owned registry output.
- [ ] Add `cn` using `clsx` and `tailwind-merge` for generated components.
- [ ] Add variant conventions with Class Variance Authority.
- [ ] Define component anatomy, data attributes, and slot conventions.
- [ ] Create shared focus, disabled, loading, empty, and error-state patterns.
- [ ] Add polymorphism only where it preserves accessible semantics.

### Foundation components

- [ ] Button and button group.
- [ ] Input, textarea, and field primitives.
- [ ] Checkbox, switch, radio group, and slider.
- [ ] Select and combobox.
- [ ] Dialog, alert dialog, drawer, and sheet.
- [ ] Popover, tooltip, hover card, and context menu.
- [ ] Badge, avatar, separator, and aspect ratio.
- [ ] Tabs, accordion, collapsible, and carousel.
- [ ] Breadcrumb, navigation menu, menubar, and pagination.
- [ ] Toast and notification region.
- [ ] Progress, spinner, skeleton, and empty state.
- [ ] Calendar, date input, and command palette.

### Forms

- [ ] Create `@brilliant-ui/forms` around React Hook Form and Zod.
- [ ] Field, label, description, and error-message composition.
- [ ] Typed schema-to-field error mapping.
- [ ] Date picker and date-range picker.
- [ ] File upload with progress, validation, and accessible drop zone.
- [ ] OTP and segmented-code input.
- [ ] Search field with suggestions and async states.
- [ ] Multi-step wizard with resumable state.
- [ ] Filter builder with typed operators.
- [ ] Dynamic form schema and renderer.
- [ ] Form builder primitives without coupling to a persistence backend.

### Data and navigation foundations

- [ ] Create `@brilliant-ui/tables` around TanStack Table.
- [ ] Data table with sorting, filtering, selection, pagination, and column visibility.
- [ ] Server-controlled and client-controlled table examples.
- [ ] Infinite and virtualized table adapters.
- [ ] Responsive table/card behavior.
- [ ] Create navigation primitives for sidebar, top bar, command navigation, and mobile navigation.

### Layouts

- [ ] Application shell and responsive sidebar.
- [ ] Dashboard layout.
- [ ] Settings layout.
- [ ] Authentication layout.
- [ ] Documentation layout.
- [ ] Detail, list/detail, and master/detail layouts.
- [ ] Container-query-based panel primitives.

### Motion and icons

- [ ] Create `@brilliant-ui/animations` with Motion presets and reduced-motion fallbacks.
- [ ] Add enter, exit, layout, list, disclosure, and feedback motion recipes.
- [ ] Create `@brilliant-ui/icons` with Lucide defaults and adapter contracts.
- [ ] Establish icon sizing, stroke, accessibility, and tree-shaking rules.

### Phase 3 exit gate

- [ ] A responsive authenticated dashboard can be built using only Phase 3 packages.
- [ ] Every shipped component meets the shared definition of done.
- [ ] Keyboard-only and screen-reader component journeys pass.
- [ ] Bundle-size budgets are recorded and enforced for foundation packages.

## Phase 4 — Enterprise, SaaS, and AI systems

Goal: add differentiated, composable product systems on top of stable foundations.

### AI components

- [ ] Prompt input with attachments, shortcuts, and model/tool controls.
- [ ] Chat thread and conversation history.
- [ ] Streaming text and structured-output renderer.
- [ ] Thinking indicator and reasoning timeline with disclosure controls.
- [ ] Tool-call viewer with pending, success, error, and approval states.
- [ ] Citation card and grouped source list.
- [ ] Safe markdown and code renderer.
- [ ] Agent status, handoff, interruption, and retry states.
- [ ] Accessible live-region strategy for streaming responses.
- [ ] Provider-neutral adapters and examples.

### Enterprise components

- [ ] Permission matrix and bulk permission editor.
- [ ] Role editor with inherited and overridden permissions.
- [ ] Organization tree with large-dataset virtualization.
- [ ] Policy builder with validation and human-readable summaries.
- [ ] Workflow builder and approval flow.
- [ ] Identity card, graph, and access timeline.
- [ ] Credential viewer with redaction and reveal auditing.
- [ ] Visitor timeline and facility selector.
- [ ] Audit explorer with filters, saved views, and export hooks.
- [ ] Multi-tenant switcher with clear tenant context.

### SaaS components

- [ ] Billing overview, plan comparison, and checkout composition.
- [ ] Invoice list and invoice detail.
- [ ] Subscription lifecycle and cancellation flows.
- [ ] API key creation, reveal, rotation, and revocation.
- [ ] Webhook endpoints, deliveries, logs, and retry flows.
- [ ] Usage meters, limits, forecasts, and overage states.
- [ ] Organizations, invitations, members, and roles.
- [ ] Notification center and preferences.
- [ ] Settings and profile modules.
- [ ] Feature flag controls and environment targeting.

### Advanced data visualization

- [ ] Create `@brilliant-ui/charts` around a mature charting foundation selected by evaluation.
- [ ] Define accessible palettes, legends, tooltips, and empty/error states.
- [ ] Metrics, sparklines, time series, comparisons, and distributions.
- [ ] Timeline, kanban, audit log, activity feed, and event stream.
- [ ] Tree table and hierarchical data exploration.
- [ ] Export and print behavior.

### Phase 4 exit gate

- [ ] Each product system has at least one complete reference journey.
- [ ] Components remain backend- and provider-neutral.
- [ ] Large-data components meet documented interaction and rendering budgets.
- [ ] Sensitive-data components document redaction, permission, and audit expectations.

## Phase 5 — Blocks, templates, and documentation

Goal: turn the component system into deployable starting points and an exceptional learning surface.

### Production blocks

- [ ] CRM dashboard.
- [ ] Administration dashboard.
- [ ] Analytics dashboard.
- [ ] Billing dashboard.
- [ ] Identity dashboard.
- [ ] Settings module.
- [ ] Authentication flow.
- [ ] Profile management.
- [ ] Audit portal.
- [ ] Organization management.
- [ ] Developer portal.
- [ ] Customer portal.
- [ ] AI workspace.

### Templates

- [ ] Next.js enterprise SaaS starter.
- [ ] Vite internal-tool starter.
- [ ] AI product starter.
- [ ] Developer portal starter.
- [ ] Documentation and knowledge-base starter.
- [ ] Landing and pricing starter.
- [ ] Every template includes authentication/persistence integration seams rather than a forced vendor.

### Documentation platform

- [ ] Component reference generated from registry metadata.
- [ ] Search, command navigation, and deep links.
- [ ] Interactive examples with copyable source.
- [ ] Props, anatomy, variants, accessibility, and performance sections.
- [ ] Do/don't visual guidance.
- [ ] Theming, migration, and integration guides.
- [ ] AI-readable documentation index and component manifest.
- [ ] Versioned documentation and upgrade guides.
- [ ] Public roadmap, release notes, and support policy.

### Playground and community

- [ ] Isolated component state explorer.
- [ ] Theme and token editor with export.
- [ ] Responsive viewport and density controls.
- [ ] Accessibility inspection controls.
- [ ] Community submission format, license review, and quality rubric.
- [ ] 21st.dev intake process with provenance and licensing records.

### Phase 5 exit gate

- [ ] A developer can choose a starter, install it, and reach a deployable app without hidden steps.
- [ ] Every public item is discoverable through docs, CLI, and registry metadata.
- [ ] Blocks demonstrate loading, empty, error, permission, and realistic data states.
- [ ] Community intake cannot bypass accessibility, licensing, or quality gates.

## Phase 6 — Release hardening

Goal: prove reliability, accessibility, performance, and maintainability before the first stable release.

### Testing and compatibility

- [ ] Define supported React, Next.js, Vite, Node.js, and browser versions.
- [ ] Run the test matrix across supported frameworks and versions.
- [ ] Add Playwright end-to-end coverage for critical journeys.
- [ ] Add cross-browser visual regression tests.
- [ ] Add registry and CLI upgrade/migration tests.
- [ ] Test clean installs with npm, pnpm, yarn, and Bun.

### Accessibility

- [ ] Complete independent WCAG 2.2 AA audit.
- [ ] Resolve all critical and serious automated violations.
- [ ] Complete keyboard-only audits for every interactive component.
- [ ] Complete VoiceOver, NVDA, and high-contrast-mode audits.
- [ ] Publish accessibility conformance and known-limitations documentation.

### Performance

- [ ] Establish and enforce per-package bundle budgets.
- [ ] Verify tree shaking and side-effect declarations.
- [ ] Profile component render behavior and large-data scenarios.
- [ ] Optimize font, icon, chart, and animation delivery.
- [ ] Run Lighthouse budgets on documentation and starter applications.
- [ ] Document server/client boundaries and lazy-loading guidance.

### Security and supply chain

- [ ] Threat-model CLI installation, remote registries, and generated source.
- [ ] Sign or attest release artifacts.
- [ ] Generate software bills of materials.
- [ ] Automate dependency and license review.
- [ ] Document vulnerability reporting and supported release lines.

### Stable release

- [ ] Freeze and review public API surfaces.
- [ ] Publish semantic-versioning and deprecation policies.
- [ ] Publish migration tooling and upgrade documentation.
- [ ] Create release candidates and collect production feedback.
- [ ] Resolve release-blocking feedback and audit findings.
- [ ] Publish Brilliant UI 1.0 packages, registry, CLI, and documentation.
- [ ] Announce the post-1.0 maintenance and feature roadmap.

### Phase 6 exit gate

- [ ] All supported installation paths pass from clean environments.
- [ ] Accessibility, performance, security, and compatibility gates are green.
- [ ] Documentation reflects the shipped API exactly.
- [ ] Maintainers have a tested release and rollback procedure.

## Decision log queue

These decisions must be recorded as architecture decision records before dependent work ships:

- [ ] ADR: package naming, publication scope, and npm organization.
- [ ] ADR: registry hosting, integrity, versioning, and trust model.
- [ ] ADR: charting foundation.
- [ ] ADR: Storybook versus a custom registry-driven component workbench.
- [ ] ADR: visual regression platform and baseline ownership.
- [ ] ADR: supported browser and framework matrix.
- [ ] ADR: telemetry policy for the CLI and documentation.
- [ ] ADR: community component licensing and provenance policy.

## Explicitly out of scope

- Reimplementing accessible primitives already provided by Radix UI.
- Building a custom form-state, table-state, schema-validation, or query library.
- Coupling core components to a specific database, authentication, billing, or AI provider.
- Shipping copied community code without license and provenance review.
- Adding a second styling system alongside Tailwind CSS.
- Treating generated placeholders as completed components or blocks.
