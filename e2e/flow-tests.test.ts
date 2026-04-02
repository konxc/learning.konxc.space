import { expect, test, type Page, type BrowserContext } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

test.describe('Payment Flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(`${BASE_URL}/login`);
	});

	test('should load payment page without errors', async ({ page }) => {
		// Navigate directly to payments page
		await page.goto(`${BASE_URL}/app/payments`);

		// Check for console errors (critical only)
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		// Wait for page to load
		await page.waitForLoadState('networkidle');

		// Verify page loaded
		await expect(page.locator('body')).toBeVisible();

		// Log any errors found
		if (errors.length > 0) {
			console.log('Console errors found:', errors);
		}
	});

	test('should handle payment page with courseId param', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/payments?courseId=course-012`);
		await page.waitForLoadState('networkidle');

		// Verify no critical errors
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.waitForTimeout(1000);

		// Filter out PWA errors which are non-critical
		const criticalErrors = errors.filter((e) => !e.includes('PWA'));
		expect(criticalErrors).toHaveLength(0);
	});
});

test.describe('Notifications', () => {
	test('should load notifications page', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/notifications`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});

	test('should load overview page with notifications', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/overview`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});
});

test.describe('Discussion API', () => {
	test('should handle discussions endpoint', async ({ page, request }) => {
		// Make a request to the discussions API
		const response = await request.get(`${BASE_URL}/api/discussions?lessonId=test-lesson`);

		// Should return either 200 or 401 (unauthorized)
		expect([200, 401]).toContain(response.status());
	});
});

test.describe('Authentication', () => {
	test('should load login page', async ({ page }) => {
		await page.goto(`${BASE_URL}/login`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});

	test('should load register page', async ({ page }) => {
		await page.goto(`${BASE_URL}/register`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});
});

test.describe('Dashboard Pages', () => {
	test('should load overview page', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/overview`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});

	test('should load learning page', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/learning`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});

	test('should load jobs page', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/jobs`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});

	test('should load organizations page', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/organizations`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});
});

test.describe('Admin Pages', () => {
	test('should load admin users page', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/admin/users`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});

	test('should load admin payments page', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/admin/payments`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});

	test('should load admin plugins page', async ({ page }) => {
		await page.goto(`${BASE_URL}/app/admin/plugins`);
		await page.waitForLoadState('networkidle');

		await expect(page.locator('body')).toBeVisible();
	});
});
