#!/usr/bin/env bash
# Sibling link prebuild step.
#
# This repo's tsconfig.json path aliases (e.g. @/zod2gql, @/dynamic-form/*)
# resolve via ../../../ paths that only exist inside a parent monorepo
# layout (client-framework). When developing the repos side-by-side as
# top-level siblings under /home/jameson/source, those aliases will not
# resolve. This script links any present siblings into node_modules so
# the build can find their compiled output, but does NOT modify
# tsconfig path aliases.
#
# Behaviour:
#   - Iterates the SIBLINGS list below.
#   - For each sibling that exists on disk: ensures it has been compiled
#     (runs `pnpm --dir <sibling> compile` if a compile script exists),
#     then `pnpm link --global` from that sibling, then `pnpm link --global
#     <pkgname>` here.
#   - Idempotent: skips if the sibling's package is already linked here.
#   - Exits 0 when siblings are absent — the link is a dev convenience,
#     not a hard requirement.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PARENT="$(cd "$HERE/.." && pwd)"

# List of sibling repos to consider linking. Each entry: <dir-name>:<pkg-name>
SIBLINGS=(
    "zod2gql:zod2gql"
    "dynamic-form:@jgrieve/dynamic-form"
)

link_sibling() {
    local dir="$1"
    local pkgname="$2"
    local sibling_path="$PARENT/$dir"

    if [[ ! -d "$sibling_path" ]]; then
        echo "[prebuild-link] sibling $dir not present at $sibling_path — skipping"
        return 0
    fi

    # Check if already linked here
    local link_target="$HERE/node_modules/$pkgname"
    if [[ -L "$link_target" ]]; then
        local resolved
        resolved="$(readlink -f "$link_target" || true)"
        local expected
        expected="$(readlink -f "$sibling_path" || true)"
        if [[ -n "$resolved" && "$resolved" == "$expected" ]]; then
            echo "[prebuild-link] $pkgname already linked to $sibling_path — skipping"
            return 0
        fi
    fi

    # Compile sibling if it has a compile script and dist is missing/stale.
    if [[ ! -d "$sibling_path/dist" ]]; then
        if grep -q '"compile"' "$sibling_path/package.json" 2>/dev/null; then
            echo "[prebuild-link] compiling sibling $dir"
            (cd "$sibling_path" && pnpm compile) || {
                echo "[prebuild-link] WARN: compile failed in $dir — continuing without link"
                return 0
            }
        fi
    fi

    echo "[prebuild-link] registering global link from $dir"
    (cd "$sibling_path" && pnpm link --global) || {
        echo "[prebuild-link] WARN: pnpm link --global failed in $dir — continuing"
        return 0
    }

    echo "[prebuild-link] linking $pkgname into $HERE"
    (cd "$HERE" && pnpm link --global "$pkgname") || {
        echo "[prebuild-link] WARN: pnpm link --global $pkgname failed — continuing"
        return 0
    }
}

for entry in "${SIBLINGS[@]}"; do
    dir="${entry%%:*}"
    pkg="${entry##*:}"
    link_sibling "$dir" "$pkg"
done

echo "[prebuild-link] done"
exit 0
