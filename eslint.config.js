import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import js from '@eslint/js';
import globals from 'globals';

export default [
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'dist/**',
			'node_modules/**',
			'src/lib/paraglide/**',
			'docs/**',
			'prototype/**',
			'**/*.svelte' // Ignore all Svelte files - handled by Svelte plugin
		]
	},
	js.configs.recommended,
	...svelte.configs.prettier,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser
			}
		}
	}
];
