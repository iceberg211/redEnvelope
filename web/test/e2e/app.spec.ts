import { test, expect } from '@playwright/test';

// 精简后的基础用例：只做最稳定的检查
test('homepage smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('链上抢红包 DApp');
  await expect(page.getByRole('heading', { name: '链上抢红包 DApp' })).toBeVisible();
  await expect(page.getByRole('button', { name: '发红包' })).toBeVisible();
  await expect(page.getByRole('button', { name: '抢红包' })).toBeVisible();
});

