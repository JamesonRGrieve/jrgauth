# Claude Code Instructions — @jgrieve/auth

This is a **React/Next.js auth UI submodule**, consumed by `client-framework` and other downstream Next.js apps. Workspace-level TS/JS standards (Direction, Casting, Ratchets, ESLint, TS, Test, Pre-commit, Hard Rules) live in `../CLAUDE.md` §7 and apply here. This file documents the rules **specific** to this repo.

Package manager: **pnpm**. Toolchain: TypeScript + Storybook + ESLint + Prettier.

---

## Current State

This repo is **not yet at workspace-grade**. Tracked debt:

- `tsconfig.json` has `"strict": false` and `"strictNullChecks": false` flagged with `// TODO Make this work.` These are not acceptable end states. Convert to a tsc-error ratchet (`.tsc-error-baseline`) and ratchet down to zero, then flip strict on.
- `target: "es5"` is stale; bump to `ESNext` once strict mode lands and the build pipeline tolerates it.
- No ratchet scripts present. Adopt the canonical `dynamic-form/scripts/` runners (`lint-ratchet.mjs`, `typecheck-ratchet.mjs`, `coverage-symmetry.mjs`, `symmetry-ratchet.mjs`) and seed baselines from the current state.
- No `vitest.config.ts` or `tests/` directory yet. Add Vitest + happy-dom and start covering the auth flow primitives.
- No CLAUDE-mandated `*.test.*` and `*.stories.*` symmetry yet. Stand up the symmetry ratchet first; it will produce the punch list.

These are tracked in `todo.json` (create one if absent).

---

## Repo-Specific Direction (in addition to workspace §7.1)

- **Auth surface is the bottleneck for every downstream app.** Breaking changes to exported component props or hook signatures need an explicit migration note in the commit body. Prefer additive prop changes; mark deprecated paths with `@deprecated` JSDoc rather than deletion.
- **No secrets in code, ever** (workspace rule, but doubly relevant here). Auth callbacks, OAuth client IDs, and tokens come from environment / runtime config, never hardcoded.
- **No HTML string interpolation with external data.** Sign-in error messages from upstream identity providers must be rendered as text nodes, never via `dangerouslySetInnerHTML`.
- **Promise hygiene.** Sign-in / sign-out flows are async; every `async` call must be `await`ed, `.catch()`-ed, or explicitly marked `void`.

---

## Path Aliases

The repo's `tsconfig.json` declares `@/auth/*` etc. relative to a parent monorepo (`../../../src/...`). These aliases are correct **only when the submodule sits inside `client-framework/src/components/auth/`**. When opening this repo standalone, the aliases will not resolve — that's expected. Do not "fix" them.

---

## Commands

```bash
pnpm install
pnpm storybook                        # Storybook dev server
pnpm build-storybook                  # Static Storybook build
pnpm lint / pnpm lint:fix
pnpm format / pnpm format:fix
pnpm typecheck                        # tsc --noEmit
```

Add the ratchet, test, and symmetry commands above as part of bringing this repo up to workspace grade.
