// eslint.config.ts
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      'eslint.config.*',
      'node_modules',
      'dist',
      'public',
      'components/ui/*',
      'components/third_party/*',
      'coverage',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
        node: true,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',

      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      'import/no-duplicates': 'warn',
      'import/newline-after-import': 'warn',

      'import/order': 'off',
    },
  },

  eslintConfigPrettier,
);
