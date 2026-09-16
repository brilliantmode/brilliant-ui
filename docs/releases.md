# Releasing @brilliantmode/ui

Publish through GitHub Actions. Do not run `pnpm publish` locally.

1. Add a Changeset for package changes and run `pnpm release:version`.
2. Run `pnpm --filter @brilliantmode/ui generate`, then `pnpm check`.
3. Verify the generated MCP catalog version and changed API/guide entries. Commit the source, changelog, version, lockfile, and generated MCP artifacts.
4. Regenerate after committing and confirm no generated diff remains.
5. Tag the release as `@brilliantmode/ui@X.Y.Z` and push the commit and tag.
6. Watch **Publish Brilliant UI** (`.github/workflows/publish-ui.yml`) and verify the published npm version before upgrading consumers.

The workflow uses npm trusted publishing (OIDC) for the `brilliantmode/brilliant-ui` repository and `publish-ui.yml` workflow. Configure that relationship on the npm package; no long-lived npm publishing token is required. Workflow dispatch on `main` accepts an existing release tag. It defaults to verification only, so registry processing delays can be rechecked without republishing. Disable `verify_only` only when a release has not yet been published. Registry checks retry for up to five minutes.

When replacing a consumer patch, upgrade the dependency and remove the patch registration/file together, refresh the consumer lockfile, and verify a frozen install and production build.
