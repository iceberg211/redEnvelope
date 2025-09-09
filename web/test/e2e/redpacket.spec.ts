import { test, expect } from '@playwright/test';

test('redpacket UI smoke and interactions', async ({ page }) => {
  await page.goto('/');

  // 标题与连接按钮存在
  await expect(page.getByRole('heading', { name: '链上抢红包 DApp' })).toBeVisible();
  await expect(page.getByTestId('rk-connect-button')).toBeVisible();

  // 发红包面板交互：输入并点击后提示失败（未连接钱包）
  await page.getByLabel('金额 (ETH)').fill('0.02');
  await page.getByLabel('个数').fill('2');
  await page.getByRole('button', { name: '发红包' }).click();
  await expect(page.getByText('发送失败')).toBeVisible();

  // 抢红包按钮在未连接时应禁用
  const claimButton = page.getByRole('button', { name: '抢红包' });
  await expect(claimButton).toBeDisabled();
});

