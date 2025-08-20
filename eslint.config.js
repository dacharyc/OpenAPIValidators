import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  js.configs.recommended,
  ...compat.extends('airbnb-base'),
  ...compat.extends('airbnb-typescript/base'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('prettier'),
  // TypeScript source files
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      'lines-between-class-members': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
    },
  },
  // TypeScript test files
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.test.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      'lines-between-class-members': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
    },
  },
  {
    files: ['src/index.ts'],
    rules: {
      'no-restricted-exports': 'off',
    },
  },
  {
    ignores: ['dist', 'coverage'],
  },
  {
    rules: {
      'prefer-arrow-callback': 'error',
      'func-names': 'off',
      'no-use-before-define': 'off',
      'require-await': 'error',
    },
  },
];
