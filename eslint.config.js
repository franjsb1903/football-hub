import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginImport from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'

export default [
	{
		ignores: ['node_modules/', 'dist/', 'build/', '.next/', '.git/'],
	},
	{
		files: ['packages/**/*.{js,ts,jsx,tsx}', '*.{js,ts,jsx,tsx}'],
		ignores: ['eslint.config.js', '**/utils.ts'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: ['./tsconfig.json', './packages/*/tsconfig.json'],
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			unicorn: pluginUnicorn,
			import: pluginImport,
			react: pluginReact,
			'react-hooks': pluginReactHooks,
			'jsx-a11y': pluginJsxA11y,
		},
		rules: {
			...pluginJs.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			...pluginUnicorn.configs.recommended.rules,
			...pluginReact.configs['recommended'].rules,
			...pluginReactHooks.configs['recommended-latest'].rules,
			...pluginJsxA11y.configs['recommended'].rules,
			'prettier/prettier': 'error',
			'react/react-in-jsx-scope': 'off',
			'unicorn/no-useless-undefined': 'off',
			'unicorn/prefer-string-replace-all': 'off',
			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'internal'],
					'newlines-between': 'always',
				},
			],
			'import/no-anonymous-default-export': [
				'error',
				{
					allowObject: true,
				},
			],
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		files: [
			'**/postcss.config.js',
			'**/next.config.js',
			'**/tailwind.config.js',
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: null,
				sourceType: 'module',
				ecmaVersion: 'latest',
			},
			globals: {
				...globals.node,
			},
		},
		plugins: {},
		rules: {
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
			'unicorn/prefer-module': 'off',
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	pluginPrettier,
]
