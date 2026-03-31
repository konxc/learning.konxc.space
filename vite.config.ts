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
	define: {
		__PWA_ENABLED__: JSON.stringify(process.env.PWA_ENABLED !== 'true'),
		__ANALYTICS_ENABLED__: JSON.stringify(process.env.ANALYTICS_ENABLED !== 'false'),
		__SW_ENABLED__: JSON.stringify(process.env.SW_ENABLED !== 'true')
	},
	build: {
		rollupOptions: {
			external: ['html2canvas', 'jspdf']
		}
	},
	ssr: {
		external: ['@libsql/client']
	},
	server: {
		host: '0.0.0.0',
		port: 5173,
		allowedHosts: ['naikkelas-app', 'learning.konxc.space', 'localhost'],
		cors: true // pastikan dev HMR juga jalan via reverse proxy
	}
});
