import { test, expect } from '@playwright/test';

test.describe('RedPacket DApp', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到应用程序
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle('链上抢红包 DApp');
    
    // 检查页面是否包含主要内容
    await expect(page.locator('text=链上抢红包')).toBeVisible();
  });

  test('should display wallet connection button', async ({ page }) => {
    // 检查钱包连接按钮
    const connectButton = page.getByRole('button', { name: /connect/i });
    await expect(connectButton).toBeVisible();
  });

  test('should have red packet creation form', async ({ page }) => {
    // 检查红包创建表单元素
    await expect(page.locator('input[placeholder*="金额"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="份数"]')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // 测试表单验证
    const sendButton = page.getByRole('button', { name: /发红包/i });
    
    // 尝试提交空表单
    await sendButton.click();
    
    // 检查是否显示验证错误
    await expect(page.locator('text=请填写')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // 检查移动端布局
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/*', route => route.abort());
    
    // 刷新页面
    await page.reload();
    
    // 检查错误处理
    await expect(page.locator('text=网络错误')).toBeVisible();
  });
});

test.describe('Red Packet Functionality', () => {
  test.skip('should create red packet with valid inputs', async ({ page }) => {
    // 注意：此测试需要连接钱包，在实际环境中可能需要模拟
    await page.goto('/');
    
    // 填写表单
    await page.fill('input[placeholder*="金额"]', '0.01');
    await page.fill('input[placeholder*="份数"]', '3');
    
    // 点击发红包按钮
    await page.getByRole('button', { name: /发红包/i }).click();
    
    // 检查成功消息或交易确认
    await expect(page.locator('text=红包创建成功')).toBeVisible();
  });

  test.skip('should claim red packet', async ({ page }) => {
    // 注意：此测试需要有效的红包 ID
    await page.goto('/');
    
    // 填写红包 ID
    await page.fill('input[placeholder*="红包ID"]', '1');
    
    // 点击抢红包按钮
    await page.getByRole('button', { name: /抢红包/i }).click();
    
    // 检查领取结果
    await expect(page.locator('text=领取成功')).toBeVisible();
  });
});