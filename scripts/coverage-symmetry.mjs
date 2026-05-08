#!/usr/bin/env node
/**
 * Symmetry gate. Enforces two coverage rules:
 *
 *   1. Every React component file (`src/**\/*.tsx`, excluding stories, tests,
 *      and `index.tsx`) must have a co-located `*.stories.tsx` sibling
 *      OR appear in `.coverage-opt-out.json` under `"stories"`.
 *
 *   2. Every non-component module (`src/**\/*.ts`, excluding `.test.ts`,
 *      `.stories.ts`, `.d.ts`, `index.ts`, `types/**`) must have a
 *      co-located `*.test.ts` sibling OR appear in `.coverage-opt-out.json`
 *      under `"tests"`.
 *
 * Pre-commit + CI gate (paired with the symmetry-ratchet for incremental
 * adoption). Without these, "every component has a story" is just a wish.
 *
 * Usage:
 *   node scripts/coverage-symmetry.mjs            # check
 *   node scripts/coverage-symmetry.mjs --json     # JSON report on stdout
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'src');
const OPT_OUT_PATH = resolve(process.cwd(), '.coverage-opt-out.json');
const args = new Set(process.argv.slice(2));
const jsonMode = args.has('--json');

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

const storyMissing = [];
const testMissing = [];

for (const file of walk(ROOT)) {
  const rel = relative(process.cwd(), file);
  if (isComponentFile(file)) {
    if (siblingExists(file, '.stories.tsx')) continue;
    if (optOut.stories?.includes(rel)) continue;
    storyMissing.push(rel);
  } else if (isModuleFile(file)) {
    if (siblingExists(file, '.test.ts')) continue;
    if (optOut.tests?.includes(rel)) continue;
    testMissing.push(rel);
  }
}

const report = { storyMissing, testMissing };
const total = storyMissing.length + testMissing.length;

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(total === 0 ? 0 : 1);
}

if (total === 0) {
  console.log('[coverage-symmetry] OK');
  process.exit(0);
}

console.error(`[coverage-symmetry] FAIL: ${total} missing pair(s)`);
if (storyMissing.length) {
  console.error(`\n  Components missing .stories.tsx (${storyMissing.length}):`);
  for (const f of storyMissing) console.error(`    ${f}`);
}
if (testMissing.length) {
  console.error(`\n  Modules missing .test.ts (${testMissing.length}):`);
  for (const f of testMissing) console.error(`    ${f}`);
}
console.error('\nFix by adding the sibling test/story file, or add the path to .coverage-opt-out.json with a reason.');
process.exit(1);
