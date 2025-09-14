import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('console', (msg) => {
    // Surface browser console logs in CI to speed up debugging
    // eslint-disable-next-line no-console
    console.log(`[browser:${msg.type()}]`, msg.text());
  });
  page.on('pageerror', (err) => {
    // eslint-disable-next-line no-console
    console.error('[pageerror]', err);
  });
});

// 精简后的基础用例：只做最稳定的检查
test('homepage smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('链上抢红包 DApp');
  await expect(page.getByRole('heading', { name: '链上抢红包 DApp' })).toBeVisible();
  await expect(page.getByRole('button', { name: '发红包' })).toBeVisible();
  await expect(page.getByRole('button', { name: '抢红包' })).toBeVisible();
});
