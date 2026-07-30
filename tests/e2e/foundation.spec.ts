import { expect, test } from '@playwright/test';

test('公开首页输出可索引正文和 canonical', async ({ page }) => {
  const response = await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: '通用 SSR 站点' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://localhost:3001/');
  expect(response?.status()).toBe(200);
});

test('首页完成客户端水合并可切换明暗主题', async ({ page }) => {
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));
  await page.goto('/');
  await page.getByRole('button', { name: '切换明暗主题' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
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

test('认证 BFF 拒绝不可信来源并返回 403', async ({ request }) => {
  const response = await request.post('/api/auth/login', {
    headers: { origin: 'https://evil.test' },
    data: { username: 'demo', password: 'secret' },
  });

  expect(response.status()).toBe(403);
  await expect(response.json()).resolves.toEqual({
    code: -1,
    data: null,
    message: '请求来源不受信任',
  });
});
