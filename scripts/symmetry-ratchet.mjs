#!/usr/bin/env node
/**
 * Coverage-symmetry ratchet. The strict gate (scripts/coverage-symmetry.mjs)
 * fails on any missing pair, which we cannot meet today. This ratchet allows
 * progress: it captures the current count of missing pairs in
 * `.symmetry-baseline` and refuses commits that increase it. As stories/tests
 * are added, the baseline drops; eventually the strict gate (run separately,
 * or by setting baseline to {0,0}) takes over.
 *
 * Update via `pnpm symmetry:ratchet:update`.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const BASELINE = resolve(process.cwd(), '.symmetry-baseline');
const ROOT = resolve(process.cwd(), 'src');
const OPT_OUT_PATH = resolve(process.cwd(), '.coverage-opt-out.json');
const args = process.argv.slice(2);
const updateMode = args.includes('--update');

const optOut = existsSync(OPT_OUT_PATH)
  ? JSON.parse(readFileSync(OPT_OUT_PATH, 'utf8'))
  : { stories: [], tests: [] };

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'storybook-static') continue;
    const full = `${dir}/${name}`;
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else if (st.isFile()) yield full;
  }
}

function siblingExists(file, suffix) {
  return existsSync(file.replace(/\.(tsx?|jsx?)$/, suffix));
}

function isComponentFile(file) {
  if (!file.endsWith('.tsx')) return false;
  if (/\.stories\.tsx$/.test(file)) return false;
  if (/\.test\.tsx$/.test(file)) return false;
  if (/\/index\.tsx$/.test(file)) return false;
  return true;
}

function isModuleFile(file) {
  if (!file.endsWith('.ts')) return false;
  if (/\.test\.ts$/.test(file)) return false;
  if (/\.stories\.ts$/.test(file)) return false;
  if (/\.d\.ts$/.test(file)) return false;
  if (/\/index\.ts$/.test(file)) return false;
  if (/\/types\//.test(file)) return false;
  return true;
}

const report = { storyMissing: [], testMissing: [] };

for (const file of walk(ROOT)) {
  const rel = relative(process.cwd(), file);
  if (isComponentFile(file)) {
    if (siblingExists(file, '.stories.tsx')) continue;
    if (optOut.stories?.includes(rel)) continue;
    report.storyMissing.push(rel);
  } else if (isModuleFile(file)) {
    if (siblingExists(file, '.test.ts')) continue;
    if (optOut.tests?.includes(rel)) continue;
    report.testMissing.push(rel);
  }
}

const cur = {
  components: report.storyMissing.length,
  modules: report.testMissing.length,
};
const serialized = JSON.stringify(cur, null, 2) + '\n';

if (updateMode) {
  writeFileSync(BASELINE, serialized, 'utf8');
  console.log(`[symmetry-ratchet] baseline updated: components=${cur.components} modules=${cur.modules}`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, serialized, 'utf8');
  console.log(`[symmetry-ratchet] baseline file missing — initialised: components=${cur.components} modules=${cur.modules}`);
  process.exit(0);
}

const base = JSON.parse(readFileSync(BASELINE, 'utf8'));
const failures = [];
for (const k of ['components', 'modules']) {
  if (cur[k] > base[k]) failures.push(`${k}: ${base[k]} -> ${cur[k]} (+${cur[k] - base[k]})`);
}

if (failures.length) {
  console.error('[symmetry-ratchet] FAIL — missing-pair count regressed:');
  for (const f of failures) console.error('  ' + f);
  console.error('Either add the missing .stories.tsx/.test.ts or, if intentional, run: pnpm symmetry:ratchet:update');
  process.exit(1);
}

const improved = ['components', 'modules'].some((k) => cur[k] < base[k]);
if (improved) {
  console.log('[symmetry-ratchet] OK: missing pairs decreased. Lower the baseline: pnpm symmetry:ratchet:update');
} else {
  console.log(`[symmetry-ratchet] OK: components=${cur.components} modules=${cur.modules} (unchanged).`);
}
process.exit(0);
