#!/usr/bin/env bash
# prebuild-link-siblings.sh
#
# For each sibling repo (../dynamic-form, ../zod2gql) that exists on disk,
# build it in-place and symlink it into node_modules/<package-name> so the
# developer's local checkout is used at build time. auth imports these as
# real package specifiers (e.g. `@jgrieve/dynamic-form/hooks/useToast`,
# `zod2gql`), so without the symlink tsc cannot resolve their types and the
# auth build emits no usable dist.
#
# If a sibling does NOT exist on disk, fall back silently to whatever is
# resolved from the registry. Missing siblings are not an error: the link is
# a dev convenience for the multi-repo workflow, not a hard requirement.
#
# Idempotent: safe to re-run. Direct symlinks (not `pnpm link --global`,
# which proved unreliable in this workspace and left node_modules unlinked).

set -u

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SIBLING_ROOT="$(cd "${THIS_DIR}/.." && pwd)"
NODE_MODULES="${THIS_DIR}/node_modules"

# Sibling directory names under SIBLING_ROOT to consider, in dependency order
# (leaf-first: zod2gql has no siblings, dynamic-form depends on nothing here).
SIBLINGS=(
    "zod2gql"
    "dynamic-form"
)

read_pkg_name() {
    node -e "process.stdout.write(require('$1/package.json').name)" 2>/dev/null
}

pm_for() {
    if [ -f "$1/pnpm-lock.yaml" ]; then
        echo "pnpm"
    else
        echo "npm"
    fi
}

link_sibling() {
    local name="$1"
    local sib_dir="${SIBLING_ROOT}/${name}"

    if [ ! -d "${sib_dir}" ]; then
        return 0  # silent: fall back to registry
    fi
    if [ ! -f "${sib_dir}/package.json" ]; then
        echo "[prebuild-link] ${name}: sibling exists but has no package.json — skipping" >&2
        return 0
    fi

    local pkg
    pkg="$(read_pkg_name "${sib_dir}")"
    if [ -z "${pkg}" ]; then
        echo "[prebuild-link] ${name}: cannot read package.json name — skipping" >&2
        return 0
    fi

    local pm
    pm="$(pm_for "${sib_dir}")"

    # Build the sibling so its dist/ (with .d.ts) exists for consumers.
    if [ ! -d "${sib_dir}/dist" ]; then
        echo "[prebuild-link] ${name}: building (${pm}) at ${sib_dir}"
        (
            cd "${sib_dir}" || exit 0
            "${pm}" run --silent compile >/dev/null 2>&1 \
                || "${pm}" run --silent build >/dev/null 2>&1 \
                || true
        )
    fi

    # Symlink into node_modules under the package's actual name (handles scopes).
    local target="${NODE_MODULES}/${pkg}"
    local parent
    parent="$(dirname "${target}")"
    mkdir -p "${parent}"

    if [ -L "${target}" ]; then
        local current
        current="$(readlink "${target}")"
        if [ "${current}" = "${sib_dir}" ]; then
            echo "[prebuild-link] ${name}: already linked (${pkg} -> ${sib_dir})"
            return 0
        fi
        rm -f "${target}"
    elif [ -e "${target}" ]; then
        rm -rf "${target}.prebuild-bak"
        mv "${target}" "${target}.prebuild-bak"
    fi

    ln -s "${sib_dir}" "${target}"
    echo "[prebuild-link] ${name}: linked ${pkg} -> ${sib_dir}"
}

for s in "${SIBLINGS[@]}"; do
    link_sibling "${s}"
done

exit 0
