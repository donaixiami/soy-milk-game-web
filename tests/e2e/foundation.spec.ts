import { expect, test } from '@playwright/test';

test('公开首页输出可索引正文和 canonical', async ({ page }) => {
  const response = await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: '通用 SSR 站点' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://localhost:3001/');
  expect(response?.status()).toBe(200);
});

test('登录页禁止搜索引擎收录', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
});

test('注册与找回密码页面提供通用认证骨架并禁止收录', async ({ page }) => {
  for (const route of [
    { path: '/register', heading: '注册' },
    { path: '/forgot-password', heading: '找回密码' },
  ]) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  }
});

test('健康检查返回进程可用状态', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ status: 'ok' });
});
