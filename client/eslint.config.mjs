// eslint.config.mjs
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { 'unused-imports': pluginUnusedImports },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
