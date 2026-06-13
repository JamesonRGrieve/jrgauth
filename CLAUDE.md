# Claude Code Instructions — @jgrieve/auth

This is a **React/Next.js auth UI submodule**, consumed by `client-framework` and other downstream Next.js apps. Workspace-level TS/JS standards (Direction, Casting, Ratchets, ESLint, TS, Test, Pre-commit, Hard Rules) live in `../CLAUDE.md` §7 and apply here. This file documents the rules **specific** to this repo.

Package manager: **pnpm**. Toolchain: TypeScript + Storybook + ESLint + Prettier.

---

## Current State

This repo is **not yet at workspace-grade**. Tracked debt:

- The flat `eslint.config.mjs` now wires the workspace §7.5 plugins: `import`, `jsx-a11y`, `eslint-comments`, `promise` (in the `**/*.{ts,tsx}` block, with their recommended rulesets + the §7.5 import/order/cycle/naming rules), plus dedicated override blocks for `vitest` (test files) and `storybook` (stories — both re-enabled in lint; previously ignored). After `pnpm install`, the ESLint warning baseline must be re-seeded with `pnpm lint:ratchet:update` (commit the baseline file in the same commit per workspace §7.3).
- A `tsconfig.strict.json` (extends `tsconfig.json`, enables `noImplicitOverride` / `noFallthroughCasesInSwitch` / `noImplicitReturns` / `noUncheckedIndexedAccess` / `noPropertyAccessFromIndexSignature` / `exactOptionalPropertyTypes`) was added to back the strict-mode ratchet. After install, seed it via `pnpm strict:ratchet:update`.
- `biome.json` gained `style.useFilenamingConvention` (kebab/camel/Pascal allowed for the React component files). After install, re-seed with `pnpm biome:ratchet:update`. All three baseline files (`pnpm lint:ratchet:update`, `pnpm strict:ratchet:update`, `pnpm biome:ratchet:update`) are committed in the same commit as the config change (workspace §7.3).
- `tsconfig.json` has `"strict": false` and `"strictNullChecks": false` flagged with `// TODO ratchet to zero and re-enable strict`. These are not acceptable end states. Convert to a tsc-error ratchet (`.tsc-error-baseline`) and ratchet down to zero, then flip strict on.
- `target: "es5"` is stale; bump to `ESNext` once strict mode lands and the build pipeline tolerates it.
- No ratchet scripts present. Adopt the canonical `dynamic-form/scripts/` runners (`lint-ratchet.mjs`, `typecheck-ratchet.mjs`, `coverage-symmetry.mjs`, `symmetry-ratchet.mjs`) and seed baselines from the current state.
- No `vitest.config.ts` or `tests/` directory yet. Add Vitest + happy-dom and start covering the auth flow primitives.
- No CLAUDE-mandated `*.test.*` and `*.stories.*` symmetry yet. Stand up the symmetry ratchet first; it will produce the punch list.

These are tracked in `todo.json` (create one if absent).

---

## Repo-Specific Direction (in addition to `/home/jameson/source/ai-prompts/typescript.md` + `/home/jameson/source/ai-prompts/react-next.md`)

The canonical exported-API contract discipline (exported props/hook signatures are a contract; additive over breaking; `@deprecated` JSDoc over deletion; migration notes for breaking changes), the no-HTML-interpolation-of-external-data rule, and promise hygiene now live in `react-next.md` (§7 / §5 / §3). Auth-specific application:

- **Auth surface is the bottleneck for every downstream app.** It is consumed by `client-framework` and other downstream Next.js apps, so the exported-API contract discipline above is load-bearing here in a way it is not for leaf components — a breaking prop/hook change ripples into every consumer at once.
- **No secrets in code, ever** (workspace rule, but doubly relevant here). Auth callbacks, OAuth client IDs, and tokens come from environment / runtime config, never hardcoded.
- **External data here is provider error messages.** Sign-in error messages from upstream identity providers are the concrete "external data" the no-HTML-interpolation rule guards — render them as text nodes, never via `dangerouslySetInnerHTML`.
- **Promise hygiene applies to the sign-in / sign-out flows** — these are the async surfaces in this repo that the rule covers.

---

## Path Aliases

The "aliases resolve only inside the parent monorepo, and standalone non-resolution is expected — don't 'fix' it" rule is canonical in `/home/jameson/source/ai-prompts/react-next.md` §7. Auth-specific detail: this repo's `tsconfig.json` declares `@/auth/*` etc. relative to a parent monorepo (`../../../src/...`), correct **only when the submodule sits inside `client-framework/src/components/auth/`**.

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
