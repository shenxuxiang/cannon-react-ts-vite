// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['build', 'node_modules'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: './tsconfig.app.json',
      },
    },

    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      // 如果确实需要 react-hooks，请先安装并导入
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...typescriptPlugin.configs.recommended.rules,
      radix: 'off',
      'no-undef': 'warn',
      'max-params': 'off',
      'no-debugger': 'off',
      'no-self-compare': 'off',
      'no-return-assign': 'off',
      'no-param-reassign': 'off',
      'react/display-name': 'off',
      'max-nested-callbacks': 'off',
      'no-implicit-coercion': 'off',
      'react/no-children-prop': 'off',
      'prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      // '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
];

