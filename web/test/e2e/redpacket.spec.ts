import { test, expect } from '@playwright/test';

// 极简冒烟测试：仅验证页面加载与关键控件可见性
test('redpacket UI smoke', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('链上抢红包 DApp');
  await expect(page.getByRole('heading', { name: '链上抢红包 DApp' })).toBeVisible();

  await expect(page.getByLabel('金额 (ETH)')).toBeVisible();
  await expect(page.getByLabel('个数')).toBeVisible();
  await expect(page.getByLabel('红包ID')).toBeVisible();

  await expect(page.getByRole('button', { name: '发红包' })).toBeVisible();
  // 未连接钱包时，抢红包按钮应禁用（与实现保持一致）
  await expect(page.getByRole('button', { name: '抢红包' })).toBeDisabled();
});
