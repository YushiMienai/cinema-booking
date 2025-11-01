import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  // Игнорируемые файлы и папки
  {
    ignores: [
      'dist/',
      'node_modules/',
      'build/',
      '*.config.js',
      '*.config.ts',
      'coverage/'
    ]
  },

  // Базовые настройки для всех JS/TS файлов (рекомендованные правила)
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  // Настройки для TypeScript файлов
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'indent': ['warn', 2, {'SwitchCase': 1}],
      'block-spacing': ['warn', 'never'],
      'object-curly-spacing': ['warn', 'never'],
      'array-bracket-spacing': ['warn', 'never'],
      'space-before-blocks': 'warn',
      'quotes': ['warn', 'single'],
      'object-curly-newline': ['warn', {'ImportDeclaration': {'minProperties': 8, 'multiline': true}}],
      'eol-last': ['warn', 'always'],
      'semi': ['warn', 'never'],
      'no-duplicate-imports': ['warn']
    }
  },

  // Настройки для React (JSX/TSX)
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      // React Hooks правила
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh для Vite
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: false}
      ],
    },
  }
]