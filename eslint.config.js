import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['dist/', 'docs/', 'node_modules/', 'demo-server/node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      globals: { window: 'readonly', document: 'readonly', localStorage: 'readonly', navigator: 'readonly', console: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', HTMLElement: 'readonly', HTMLDivElement: 'readonly', HTMLInputElement: 'readonly', KeyboardEvent: 'readonly', MouseEvent: 'readonly', fetch: 'readonly', URL: 'readonly', Blob: 'readonly' },
    },
    rules: {
      // Classic hook rules only — react-hooks v7 "recommended" adds React Compiler
      // diagnostics that flag pre-existing patterns (TanStack table, the GridApi
      // stale-closure Proxy) this behavior-preserving refactor must not rewrite.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // TData/meta plumbing predates the refactor; tightening `any` usage is tracked
      // separately and out of scope for behavior-preserving structural work.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  }
);
