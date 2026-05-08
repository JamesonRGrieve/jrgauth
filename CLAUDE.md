# Claude Code Instructions — @jgrieve/auth

This is a **React / Next.js authentication & account-management component library** published as `@jgrieve/auth`. It ships login / register / MFA / OAuth2 flows, account & team management surfaces, a Stripe pricing-table wrapper, an auth-aware router, and a Next.js middleware that resolves the active user before each request.

The library is consumed by other apps via the `dist/` build (TypeScript → JS, Tailwind CSS shipped alongside). Stories under `src/**/*.stories.{ts,tsx}` exercise components in isolation; Vitest + happy-dom covers pure logic, hooks, and utility modules.

---

## Direction (every change must advance these)

These are not optional polish items. Every PR, refactor, and new component must move the codebase in these directions, or it does not land. A change that is neutral on all of them is suspicious — ask whether it's worth doing.

1. **Full strong TypeScript coverage.** No new `any`. No new `@ts-ignore` / `@ts-expect-error` (existing suppressions may stay until the underlying issue is fixed, but every PR should reduce, not grow, that count). New code is fully typed at signatures and return values; prefer narrow types over `unknown`. **Never resort to `any`** for convenience, even for complex hook signatures; use generics or precise interfaces. **Fix the root cause, not the symptom**: if the compiler complains about a "possibly undefined" property, do not sprinkle null coalescers (`??`) or optional chaining (`?.`) throughout the logic. Tighten the underlying interface so the compiler can safely infer property existence. Inference is always preferred over casting. The repo is migrating to `strict: true`; treat new files as if strict is already on.

2. **Full DRY.** No copy-paste between forms, hooks, mutation flows, or auth-state handlers. Extract shared utilities into `src/utils.ts`, `src/hooks/`, or a dedicated module. If you write similar logic twice, the third time you extract — and prefer extracting on the second instance when the abstraction is obvious. Common form patterns (zod schema + `react-hook-form` + submit handler + error toast) belong in a single primitive, not duplicated across `Login.tsx`, `Register.tsx`, `Identify.tsx`, etc.

3. **Every component has a story.** Sheets, dialogs, prompts, forms, cards, menus, table cells — anything user-facing gets a `*.stories.tsx` co-located with the component. A "renders without throwing" story is the floor, not the ceiling: stories with interactivity use Storybook's `play` function (or Vitest + happy-dom against the rendered output) to assert on clicks, form submission, validation errors. The `symmetry` ratchet (pre-commit) blocks commits that increase the count of components without stories.

4. **Pure logic gets a Vitest test.** Hooks (`src/hooks/`), utilities (`src/utils.ts`, `src/gravatar.ts`), middleware logic (`src/auth.middleware.ts`), and zod schemas all get unit tests in co-located `*.test.ts` files. UI behavior is exercised in stories; non-UI logic is exercised in Vitest. `pnpm test` must pass before commit.

5. **Player-facing strings stay readable.** This library doesn't ship its own i18n layer — consuming apps wire their own. Strings should be plain English passed in via props where the consumer might want to override them. Hard-coded strings are acceptable in stories and demos; in production components, prefer accepting an optional `labels` prop or a translation function.

---

## Coverage metrics & ratchets

The repo enforces direction via one-way ratchets: any PR may improve a metric, no PR may regress one. When a metric drops, run the matching `*:ratchet:update` to lower the baseline in the same commit. The pre-commit hook runs all ratchets in sequence; bypassing with `--no-verify` requires explicit user authorization.

### Ratchet inventory

| Direction | Ratchet | Baseline file |
| --- | --- | --- |
| `tsc --noEmit` total error count | `pnpm typecheck:ratchet` | `.tsc-error-baseline` |
| ESLint warning count | `pnpm lint:ratchet` | `.eslint-warning-baseline` |
| Component → story / module → test pairing | `pnpm symmetry:ratchet` | `.symmetry-baseline` |

ESLint **errors** are never allowed — only warnings ride the ratchet. If a rule is genuinely too noisy to fix in one PR, demote it to a warning rather than disabling it; the ratchet then captures it and lets future PRs grind it down.

The strict version of the symmetry gate (`pnpm symmetry`) fails on any missing pair — once the baseline reaches `{components: 0, modules: 0}`, swap the pre-commit hook to that and remove the ratchet.

### Adaptation procedure when the canonical recipe doesn't apply

These rules are a starting point, not a contract. When you encounter a case the recipe doesn't cleanly cover, follow this loop:

1. **Run the metric first.** Capture the current count before the change (`pnpm lint`, `pnpm typecheck`, `pnpm symmetry`). If the count doesn't move after your change, you mis-targeted.
2. **Prefer a smaller in-scope win over a bigger half-finished one.** If the planned cleanup is large enough that you can't finish it in the current session without losing review quality, pick the smallest isolated cluster, fix that, advance the ratchet, and document what you skipped in the commit body.
3. **Codify any pivot in this CLAUDE.md.** When you adapt — pick a different tool than the recipe specified, discover a constraint the recipe didn't mention — write it back into the relevant section so the next session doesn't rediscover it. Adapt-then-codify keeps the recipe living instead of stale.

### Pre-commit pipeline (in order)

1. `lint-staged` — `eslint --fix` and `prettier` on staged files.
2. `typecheck:ratchet` — `tsc --noEmit` total error count cannot rise.
3. `lint:ratchet` — ESLint warning count cannot rise; errors are never allowed.
4. `symmetry:ratchet` — missing-story / missing-test counts cannot rise.
5. `vitest run` — full Vitest suite must pass.
6. (CI only) Storybook Playwright integration tests.

If a hook fails, investigate and fix; do not silence with `--no-verify`.

---

## Architecture

### Layering

| Layer | Purpose | Example |
| --- | --- | --- |
| **Hook** | Data fetching + cache (SWR) | `src/hooks/useUser.ts` |
| **Schema** | Zod input/output shapes | `src/hooks/z.ts` |
| **Component** | UI, form wiring, navigation | `src/Login.tsx`, `src/management/Account.tsx` |
| **Middleware** | Edge-side auth resolution for Next.js | `src/auth.middleware.ts` |

Components are presentation shells. Networking, caching, and validation live in hooks and schemas. A component that calls `axios` or `graphql-request` directly is a smell — wrap it in a hook.

### Auth flow

```
<Router>
  └── <AuthenticationContext.Provider>
        ├── /login   → <Login />
        ├── /register → <Register />
        ├── /identify → <Identify />   (passwordless / magic link)
        ├── /mfa/*    → MFA challenge components
        └── /oauth2/* → OAuth2 callback
```

`AuthenticationContext` exposes the current user, a refresh callback, and the active session token. Components consume it via `useUser()` (which wraps SWR). Never read auth state from `localStorage` / `cookies` inside a component — go through the context or the hook.

### Stripe surface

`src/Stripe/PricingTable.tsx` wraps Stripe's hosted pricing table. The component does not own subscription state — that's `useProducts()` / `useTeam()`. Treat it as a read-only embed.

---

## Build, test, dev

```bash
pnpm install                          # install deps (uses pnpm-lock.yaml)
pnpm compile                          # tsc → dist/, copy Style + tailwind config
pnpm storybook                        # Storybook dev server (port 6006)
pnpm build-storybook                  # Static Storybook build → storybook-static/
pnpm test                             # Vitest run
pnpm test:watch                       # Vitest watch
pnpm test:coverage                    # Vitest with v8 coverage
pnpm typecheck                        # tsc --noEmit
pnpm lint                             # ESLint over src/
pnpm lint:fix                         # ESLint --fix
pnpm format                           # Prettier check
pnpm format:fix                       # Prettier write
pnpm check                            # Aggregate: lint + format + typecheck + test
pnpm symmetry                         # Components without stories, modules without tests

# Ratchet baselines (run after a metric drops, in the same commit)
pnpm typecheck:ratchet:update
pnpm lint:ratchet:update
pnpm symmetry:ratchet:update

# Storybook integration tests (Playwright against the static build)
pnpm test:storybook:integration
```

---

## Hard rules (operational)

- **Never use `sed` or `awk` to edit files.** Always use the Edit tool for reviewability.
- **Never `rm -rf` inside `node_modules/`** to "fix" install errors. Just run `pnpm install`.
- **Wait for lint-staged hooks on commit.** Don't retry or interrupt.
- **Batch edits at the end** of a multi-file task — make all changes first, then build / test once.
- **Don't commit a baseline regression** without a comment explaining why the metric moved the wrong direction. Ratchet updates are reversible; a silent regression hides debt.

---

## Project quick reference

| Key | Value |
| --- | --- |
| Package | `@jgrieve/auth` |
| Framework | React 19 + Next.js 16 |
| Language | TypeScript (strict, migration in progress) |
| Build | `tsc` → `dist/` + Tailwind copy |
| Tests | Vitest + happy-dom |
| Stories | Storybook 10 (Next.js framework) |
| Forms | `react-hook-form` + `zod` (via `@hookform/resolvers`) |
| Data | SWR + `axios` / `graphql-request` |
| Styling | Tailwind + Radix UI primitives + shadcn-style wrappers |
| Package manager | pnpm |
