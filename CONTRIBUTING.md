# Contributing

Use Node.js 20 or newer and pnpm 10.

```sh
pnpm install
pnpm check
```

All public code must be strictly typed, accessible by construction, and backed by tests. Prefer
integrating a focused mature library over introducing a parallel primitive. New registry items
must include user-facing documentation and AI metadata in the same change.

Commit messages should explain why a change belongs in the framework. Keep package boundaries
intact and avoid adding dependencies to `@brilliant-ui/core` unless they are essential.
