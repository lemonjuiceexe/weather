import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import parser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
    { ignores: ['dist'] },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            parser,
            globals: globals.browser,
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        extends: [
            js.configs.recommended,
            'plugin:@typescript-eslint/recommended-type-checked',
            'plugin:react-hooks/recommended-type-checked'
        ],
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                {allowConstantExport: true},
            ],

            "indent": ["error", 4],
            "semi": ["error", "always"],
            "quotes": ["error", "double"],
            "comma-dangle": ["error", "never"],
            "object-curly-spacing": ["error", "always"],
            "block-spacing": ["error", "always"],
        },
    }
];
