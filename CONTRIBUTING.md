# Contributing to axe-hud

Thanks for your interest in improving axe-hud! This document covers local setup and the
conventions the project follows.

## Prerequisites

- Node.js (see [`.nvmrc`](./.nvmrc) for the supported version)
- [pnpm](https://pnpm.io/) (the version is pinned via the `packageManager` field)

## Setup

```sh
pnpm install
```

This also installs the Git hooks (via Husky).

## Common scripts

| Command           | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | Build in watch mode.                                 |
| `pnpm build`      | Produce the ESM + CJS bundles and type declarations. |
| `pnpm test`       | Run the test suite once.                             |
| `pnpm test:watch` | Run tests in watch mode.                             |
| `pnpm typecheck`  | Type-check without emitting.                         |
| `pnpm lint`       | Lint the codebase.                                   |
| `pnpm format`     | Format the codebase with Prettier.                   |
| `pnpm changeset`  | Record a changeset for a user-facing change.         |

## Commit conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages
are validated by `commitlint` via a Git hook. Allowed types: `feat`, `fix`, `docs`, `chore`,
`test`, `refactor`, `build`, `ci`, `perf`. Keep the subject lowercase and under 72 characters.

Recommended scopes: `env`, `navigation`, `runner`, `store`, `ui`, `widget`, `sidebar`, `modal`,
`highlight`, `react`, `a11y`, `examples`, `deps`.

Keep commits atomic — one logical change each, with tests where applicable.

## Changesets

Any change that affects published behavior must include a changeset:

```sh
pnpm changeset
```

Pick the appropriate bump (patch / minor / major) and describe the change for the changelog.

## Reporting issues

Use the issue templates for bug reports and feature requests. For security issues, see
[SECURITY.md](./SECURITY.md).
