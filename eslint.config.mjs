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
            'react/jsx-key': 'warn',
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
