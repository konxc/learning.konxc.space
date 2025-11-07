import { paraglideVitePlugin } from '@inlang/paraglide-js';
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	build: {
		rollupOptions: {
			external: ['html2canvas', 'jspdf']
		}
	},
	server: {
		host: '0.0.0.0',
		port: 5173,
		allowedHosts: ['naikkelas-app', 'learning.konxc.space', 'localhost'],
		cors: true // pastikan dev HMR juga jalan via reverse proxy
	}
});
