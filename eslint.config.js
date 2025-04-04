import globals from 'globals'
import eslintJs from '@eslint/js'
import tseslint from 'typescript-eslint'
// import reactCompiler from 'eslint-plugin-react-compiler'
import stylistic from '@stylistic/eslint-plugin-js'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import indentEmptyLinesPlugin from 'eslint-plugin-indent-empty-lines'

// @todo investigate these
// https://github.com/dustinspecker/awesome-eslint
// https://github.com/github/eslint-plugin-github
// https://github.com/sindresorhus/eslint-plugin-unicorn
// https://github.com/francoismassart/eslint-plugin-tailwindcss

// Turn this on while developing for extra hints, but
// disable before committing, since it generates tons of warnings
const strictMode = false

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(
    
    // global ignores
    {
        ignores: [
            'eslint.config.js', // Ignore this file to avoid the TSConfig error
            'tailwind.config.mjs',
            'dist/**',
            'build/**',
            'node_modules/**',
            'next.config.mjs',
            'tsconfig.json',
            'postcss.config.mjs',
            '.next/**',
            'assets/typedefs/**',
            'components/ui/**',
        ],
    },
    
    {
        files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
        extends: [
            eslintJs.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest', // Needed or JSX breaks
            parser: tseslint.parser, // Add TypeScript parser
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
            },
            globals: {
                ...globals.browser,
                process: 'readonly',
                Logger: 'readonly',
            },
        },
        plugins: {
            react: reactPlugin,
            // 'react-compiler': reactCompiler,
            'react-hooks': reactHooksPlugin,
            '@stylistic': stylistic,
            'indent-empty-lines': indentEmptyLinesPlugin,
            '@typescript-eslint': tseslint.plugin, // Add TypeScript plugin
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...eslintJs.configs.recommended.rules,
            // Spread TypeScript recommended rules
            ...tseslint.configs.recommended.reduce((acc, config) => ({
                ...acc,
                ...config.rules,
            }), {}),
            // 'react-compiler/react-compiler': 'error',
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            
            'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': strictMode ? 'error' : 'off', // @todo nice to have eventually
            'react/jsx-no-literals': 'off',
            'react/jsx-closing-bracket-location': ['error', 'after-props'],
            
            'no-restricted-globals': ['error', 'document'],
            
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'JSXAttribute[ name.name="className" ] > JSXExpressionContainer' +
                        '> TemplateLiteral > TemplateElement[source.raw*="z-"]',
                    message: 'Avoid using Tailwind z-index classes in JSX.',
                },
                {
                    selector: 'JSXAttribute[ name.name="style" ] > JSXExpressionContainer' +
                        '> ObjectExpression > Property[key.name="zIndex"] > Literal',
                    message: 'Avoid using Tailwind z-index values directly in style props.',
                },
                {
                    selector: 'CallExpression[callee.name="setSearchParams"] > ObjectExpression',
                    message: 'Use the callback syntax for setSearchParams.',
                },
            ],
            'indent': [
                'error',
                4,
                {
                    SwitchCase: 1,
                },
            ],
            'linebreak-style': [
                'error',
                'unix',
            ],
            'quotes': [
                'error',
                'single',
            ],
            'semi': [
                'error',
                'never',
            ],
            'arrow-parens': ['error', 'as-needed'],
            'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
            'comma-dangle': ['error', 'always-multiline'],
            'max-len': ['error', { 'code': 120 }],
            'block-spacing': ['error', 'always'],
            'space-before-blocks': ['error', 'always'],
            'indent-empty-lines/indent-empty-lines': ['error', 4],
            'keyword-spacing': ['error', { 'before': true, 'after': true }],
            '@stylistic/padding-line-between-statements': [
                'error',
                // { blankLine: 'always', prev: '*', next: 'return' }, // @todo nice to have
                { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
                { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
                { blankLine: 'always', prev: 'directive', next: '*' },
                { blankLine: 'any', prev: 'directive', next: 'directive' },
                { blankLine: 'always', prev: 'block-like', next: '*' },
                { blankLine: 'always', prev: '*', next: 'block-like' },
                { blankLine: 'always', prev: 'function', next: '*' },
                { blankLine: 'always', prev: '*', next: 'function' },
                { blankLine: 'always', prev: 'class', next: '*' },
                { blankLine: 'always', prev: '*', next: 'class' },
                { blankLine: 'always', prev: 'export', next: '*' },
                { blankLine: 'any', prev: '*', next: 'export' },
                { blankLine: 'always', prev: 'import', next: '*' },
                { blankLine: 'any', prev: 'import', next: 'import' },
            ],
            'radix': ['error', 'always'],
            'no-eq-null': 'error',
            'object-curly-spacing': ['error', 'always'],
            
            // Optional: Add some common TypeScript-specific rules
            '@typescript-eslint/array-type': ['error', { default: 'array' }],
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
            '@typescript-eslint/no-explicit-any': 0,
        },
    },
)
