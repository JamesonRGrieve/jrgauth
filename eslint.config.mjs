// Minimal ESLint v10 flat config.
//
// The legacy .eslintrc.json in this repo references plugins/configs that are
// incompatible with ESLint v10's flat config (e.g. older `plugin:.../recommended`
// shapes that fail schema validation). Migrating the full legacy ruleset is
// tracked debt; in the meantime this flat config exists so:
//   - `pnpm lint` produces a runnable result
//   - `pnpm lint:ratchet` can seed and gate a baseline
//   - regressions in basic code health are still caught
//
// As rules are migrated from .eslintrc.json into here (or a dedicated module),
// the warning baseline ratchets up; once parity is achieved the legacy file
// can be deleted.
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'storybook-static/**',
            '.next/**',
            'coverage/**',
            'src/**/*.stories.*',
            '.storybook/**',
            'tests/**',
        ],
    },
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
                project: './tsconfig.json',
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                process: 'readonly',
                fetch: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                module: 'readonly',
                require: 'readonly',
                global: 'readonly',
                React: 'readonly',
                JSX: 'readonly',
                NodeJS: 'readonly',
                HTMLElement: 'readonly',
                HTMLInputElement: 'readonly',
                HTMLDivElement: 'readonly',
                HTMLButtonElement: 'readonly',
                HTMLFormElement: 'readonly',
                HTMLTextAreaElement: 'readonly',
                Event: 'readonly',
                MouseEvent: 'readonly',
                KeyboardEvent: 'readonly',
                FormData: 'readonly',
                File: 'readonly',
                FileReader: 'readonly',
                Blob: 'readonly',
                FocusEvent: 'readonly',
                ChangeEvent: 'readonly',
                Image: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                prompt: 'readonly',
                location: 'readonly',
                history: 'readonly',
                crypto: 'readonly',
                AbortController: 'readonly',
                FormDataEntryValue: 'readonly',
                RequestInit: 'readonly',
                Response: 'readonly',
                Request: 'readonly',
                Headers: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'unused-imports': unusedImports,
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // Errors from base recommended that are too noisy for legacy code:
            'no-unused-vars': 'off',
            'no-undef': 'off', // TS handles undef checks; many React/JSX globals not declared
            'no-empty': 'warn',
            'no-prototype-builtins': 'warn',
            'no-useless-escape': 'warn',
            'no-case-declarations': 'warn',
            'no-constant-condition': 'warn',
            'no-fallthrough': 'warn',
            'no-irregular-whitespace': 'warn',
            'no-async-promise-executor': 'warn',
            'no-empty-pattern': 'warn',
            'no-extra-boolean-cast': 'warn',
            'no-self-assign': 'warn',
            'no-sparse-arrays': 'warn',
            'no-unsafe-finally': 'warn',
            'no-unsafe-optional-chaining': 'warn',

            // Hygiene
            'unused-imports/no-unused-imports': 'warn',
            'react/jsx-uses-react': 'warn',
            'react/jsx-uses-vars': 'warn',
            'react/no-unescaped-entities': 'warn',
            // Existing source has rules-of-hooks violations inside table-cell
            // render fns. Track as warnings via the ratchet baseline; flip back
            // to 'error' once the baseline reaches zero for these specific rules.
            'react-hooks/rules-of-hooks': 'warn',
            'no-redeclare': 'warn',
            'no-constant-binary-expression': 'warn',
            'no-import-assign': 'warn',
            'react-hooks/exhaustive-deps': 'warn',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',

            // Workspace §7.4 ruleset (foundry-parity). All warn-level, absorbed
            // by lint:ratchet. Existing baseline must be reseeded after the
            // first install via `pnpm lint:ratchet:update`.
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
            '@typescript-eslint/consistent-type-exports': ['warn', { fixMixedExportsWithInlineTypeSpecifier: true }],
            '@typescript-eslint/no-import-type-side-effects': 'warn',
            '@typescript-eslint/method-signature-style': ['warn', 'property'],
            '@typescript-eslint/no-useless-empty-export': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
            '@typescript-eslint/no-confusing-non-null-assertion': 'warn',
            '@typescript-eslint/ban-ts-comment': [
                'warn',
                {
                    'ts-expect-error': 'allow-with-description',
                    'ts-ignore': true,
                    'ts-nocheck': true,
                    minimumDescriptionLength: 5,
                },
            ],
            '@typescript-eslint/dot-notation': ['warn', { allowIndexSignaturePropertyAccess: true }],
            'dot-notation': 'off',

            // Type-aware (parserOptions.project enabled above)
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-misused-promises': 'warn',
            '@typescript-eslint/await-thenable': 'warn',
            '@typescript-eslint/require-await': 'warn',
            '@typescript-eslint/unbound-method': 'warn',
            '@typescript-eslint/no-base-to-string': 'warn',
            '@typescript-eslint/restrict-template-expressions': 'warn',
            '@typescript-eslint/restrict-plus-operands': 'warn',
            '@typescript-eslint/no-for-in-array': 'warn',
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/strict-boolean-expressions': [
                'warn',
                {
                    allowString: true,
                    allowNumber: true,
                    allowNullableObject: true,
                    allowNullableBoolean: false,
                    allowNullableString: false,
                    allowNullableNumber: false,
                    allowAny: false,
                },
            ],
            '@typescript-eslint/prefer-nullish-coalescing': ['warn', { ignorePrimitives: { string: true } }],
            '@typescript-eslint/prefer-optional-chain': 'warn',
            '@typescript-eslint/switch-exhaustiveness-check': 'warn',
            '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'warn',
            '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
            '@typescript-eslint/no-meaningless-void-operator': 'warn',
            '@typescript-eslint/no-mixed-enums': 'warn',
            '@typescript-eslint/no-duplicate-type-constituents': 'warn',
            '@typescript-eslint/no-redundant-type-constituents': 'warn',
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/prefer-enum-initializers': 'warn',
            '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
            '@typescript-eslint/prefer-return-this-type': 'warn',
            '@typescript-eslint/prefer-includes': 'warn',
            '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
            '@typescript-eslint/prefer-find': 'warn',
            '@typescript-eslint/prefer-readonly': 'warn',
            '@typescript-eslint/require-array-sort-compare': ['warn', { ignoreStringArrays: true }],
            '@typescript-eslint/promise-function-async': 'warn',
            '@typescript-eslint/return-await': ['warn', 'in-try-catch'],

            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': ['warn', { builtinGlobals: false, hoist: 'all' }],
            'no-self-compare': 'warn',
            'no-template-curly-in-string': 'warn',
            'no-unreachable-loop': 'warn',
            'no-new-func': 'warn',
            'no-useless-concat': 'warn',
            'no-useless-return': 'warn',
            'no-lonely-if': 'warn',
            'no-unneeded-ternary': 'warn',
            'no-await-in-loop': 'warn',
            'no-promise-executor-return': 'warn',
            'require-atomic-updates': 'warn',
            'array-callback-return': 'warn',
            'no-constructor-return': 'warn',
            'default-case-last': 'warn',
            'grouped-accessor-pairs': 'warn',
            'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
            'prefer-rest-params': 'warn',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',
            'no-alert': 'warn',
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-throw-literal': 'warn',
            eqeqeq: ['warn', 'always'],
            curly: ['warn', 'all'],
            'prefer-template': 'warn',
            'no-param-reassign': ['warn', { props: false }],
            'consistent-return': 'warn',
            complexity: ['warn', 25],
            'max-depth': ['warn', 5],

            'no-restricted-syntax': [
                'warn',
                {
                    selector:
                        "TSAsExpression > TSTypeReference[typeName.name='Record'] > TSTypeParameterInstantiation > TSAnyKeyword",
                    message:
                        'Avoid `as Record<string, any>`. Type the value precisely; use `Record<string, unknown>` only at framework boundaries.',
                },
                {
                    selector: 'TSAsExpression > TSUnknownKeyword',
                    message:
                        'Avoid `as unknown` to bypass type errors. Validate at the boundary and propagate the narrow type.',
                },
                {
                    selector: "TSAsExpression[typeAnnotation.type='TSAnyKeyword']",
                    message: 'Avoid `as any`. Fix the type at its source.',
                },
            ],

            'react/jsx-key': 'error',
            'react/jsx-no-undef': 'error',
            'react/jsx-no-duplicate-props': 'warn',
            'react/jsx-no-target-blank': 'warn',
            'react/jsx-no-useless-fragment': 'warn',
            'react/jsx-pascal-case': 'warn',
            'react/no-array-index-key': 'warn',
            'react/no-children-prop': 'warn',
            'react/no-danger': 'warn',
            'react/no-deprecated': 'warn',
            'react/no-direct-mutation-state': 'warn',
            'react/no-unstable-nested-components': 'warn',
            'react/no-unused-state': 'warn',
            'react/self-closing-comp': 'warn',
        },
    },
    {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly',
                console: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
        },
    },
];
