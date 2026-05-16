#!/usr/bin/env node
/**
 * Count hard-coded color and non-token spacing literals in CSS.
 *
 * Direction: design tokens (CSS custom properties, Tailwind theme values)
 * should replace raw literals. Both counts should fall to zero.
 *
 * Colors: `#rrggbb` / `#rgb` / `#rrggbbaa`, `rgb(...)`, `rgba(...)`,
 *         `hsl(...)`, `hsla(...)` outside `var(--...)` references.
 * Spacing: bare `<n>px` / `<n>rem` / `<n>em` literals appearing in declared
 *          property values (excluding 0 and tokens inside `var(...)`).
 *
 * Output: prints `<colors>/<spacing>` to stdout. Writes
 * `.theme-coverage.json` with breakdown.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = resolve(process.cwd(), 'src');

function walk(dir) {
    const out = [];
    if (!existsSync(dir)) return out;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === 'dist') continue;
            out.push(...walk(full));
        } else if (/\.(css|scss)$/i.test(entry.name)) {
            out.push(full);
        }
    }
    return out;
}

const cssFiles = walk(SRC).sort();

const COLOR_PATTERNS = [
    /#[0-9a-fA-F]{3,8}\b/g,
    /\brgba?\s*\([^)]*\)/g,
    /\bhsla?\s*\([^)]*\)/g,
];
// Match bare px/rem/em literals in declarations, but skip plain `0`.
const SPACING_PATTERN = /(?<![\w-])(?!0(?:px|rem|em)\b)(\d+(?:\.\d+)?)(px|rem|em)\b/g;

let colors = 0;
let spacing = 0;
const perFile = {};

for (const path of cssFiles) {
    const text = readFileSync(path, 'utf8');
    // Strip comments so they don't pollute the count.
    const stripped = text.replace(/\/\*[\s\S]*?\*\//g, '');
    let fileColors = 0;
    let fileSpacing = 0;
    for (const pat of COLOR_PATTERNS) {
        const matches = stripped.match(pat);
        if (matches) fileColors += matches.length;
    }
    const spacingMatches = stripped.match(SPACING_PATTERN);
    if (spacingMatches) fileSpacing += spacingMatches.length;
    if (fileColors || fileSpacing) {
        perFile[path] = { colors: fileColors, spacing: fileSpacing };
    }
    colors += fileColors;
    spacing += fileSpacing;
}

const report = {
    generatedAt: new Date().toISOString(),
    cssFiles,
    colors,
    spacing,
    perFile,
};

writeFileSync('.theme-coverage.json', `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`${colors}/${spacing}`);
