import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	timeout: 30_000,
	use: {
		baseURL: 'http://localhost:5173',
		headless: true,
		viewport: { width: 1280, height: 800 },
		trace: 'on-first-retry',
		video: 'on',
		screenshot: 'only-on-failure'
	},
	webServer: {
		command: 'pnpm run dev -- --port=5173',
		url: 'http://localhost:5173',
		reuseExistingServer: true,
		timeout: 120_000
	}
});
