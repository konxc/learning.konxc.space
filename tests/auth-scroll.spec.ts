import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import path from 'node:path';

async function expectPageScrollable(page: Page, name: string): Promise<void> {
	// Evaluate scrollability of the main document
	const { scrollHeight, clientHeight, canScroll } = await page.evaluate(() => {
		const docEl = document.scrollingElement || document.documentElement;
		return {
			scrollHeight: docEl.scrollHeight,
			clientHeight: docEl.clientHeight,
			canScroll: docEl.scrollHeight > docEl.clientHeight
		};
	});

	expect(scrollHeight).toBeGreaterThan(clientHeight);
	expect(canScroll).toBeTruthy();

	// Try to scroll and assert the scroll position changes
	await page.evaluate(() => {
		const docEl = document.scrollingElement || document.documentElement;
		window.scrollTo({ top: docEl.scrollHeight, behavior: 'instant' as any });
	});
	const y = await page.evaluate(() => window.scrollY);
	expect(y).toBeGreaterThan(0);

	// Save before/after screenshots
	const artifactsDir = path.resolve('tests-artifacts');
	await page.screenshot({
		path: path.join(artifactsDir, `${name}-after-scroll.png`),
		fullPage: true
	});
}

test.describe('Auth pages are scrollable as a whole card', () => {
	test('signin page scrolls the page (card moves)', async ({ page }) => {
		await page.goto('/auth/signin');
		await page.getByText('Masuk ke Akun').waitFor();

		// Ensure card exists
		const card = page.locator('.auth-container');
		await expect(card).toBeVisible();

		await page.screenshot({
			path: path.join('tests-artifacts', 'signin-before.png'),
			fullPage: true
		});
		await expectPageScrollable(page, 'signin');
	});

	test('signup page scrolls the page (card moves)', async ({ page }) => {
		await page.goto('/auth/signup');
		await page.getByText('Daftar Akun').waitFor();

		const card = page.locator('.auth-container');
		await expect(card).toBeVisible();

		await page.screenshot({
			path: path.join('tests-artifacts', 'signup-before.png'),
			fullPage: true
		});
		await expectPageScrollable(page, 'signup');
	});
});
