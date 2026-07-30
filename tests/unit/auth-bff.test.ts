import { describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { createAuthBffService } from '../../layers/core/server/utils/auth-bff';
import { useSessionStore } from '../../layers/core/app/stores/session';

function createFixture() {
  const cookies = {
    clear: vi.fn(),
    setTokens: vi.fn(),
  };
  const backend = {
    login: vi.fn().mockResolvedValue({
      accessToken: 'access-secret',
      refreshToken: 'refresh-secret',
      session: { id: 7, nickname: '玩家' },
    }),
    logout: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn().mockResolvedValue({
      accessToken: 'next-access',
      refreshToken: 'next-refresh',
      session: { id: 7, nickname: '玩家' },
    }),
    session: vi.fn().mockResolvedValue({ id: 7, nickname: '玩家' }),
  };

  return { backend, cookies, service: createAuthBffService({ backend, cookies }) };
}

describe('认证 BFF', () => {
  it('登录成功后将令牌写入 Cookie 且正文仅返回会话', async () => {
    const { backend, cookies, service } = createFixture();

    const result = await service.login({ username: 'demo', password: 'secret' });

    expect(backend.login).toHaveBeenCalledWith({ username: 'demo', password: 'secret' });
    expect(cookies.setTokens).toHaveBeenCalledWith('access-secret', 'refresh-secret');
    expect(result).toEqual({ session: { id: 7, nickname: '玩家' } });
    expect(JSON.stringify(result)).not.toContain('secret');
  });

  it('查询会话只向后端发送 access Token', async () => {
    const { backend, service } = createFixture();

    const result = await service.getSession('access-secret');

    expect(backend.session).toHaveBeenCalledWith('access-secret');
    expect(result).toEqual({ session: { id: 7, nickname: '玩家' } });
  });

  it('刷新成功后轮换 Cookie 且正文不暴露令牌', async () => {
    const { backend, cookies, service } = createFixture();

    const result = await service.refresh('refresh-secret');

    expect(backend.refresh).toHaveBeenCalledWith('refresh-secret');
    expect(cookies.setTokens).toHaveBeenCalledWith('next-access', 'next-refresh');
    expect(result).toEqual({ session: { id: 7, nickname: '玩家' } });
  });

  it('刷新失败时清理全部认证 Cookie', async () => {
    const { backend, cookies, service } = createFixture();
    backend.refresh.mockRejectedValueOnce(new Error('refresh rejected'));

    await expect(service.refresh('expired-refresh')).rejects.toThrow('refresh rejected');

    expect(cookies.clear).toHaveBeenCalledOnce();
  });

  it('登出无论后端是否成功都会清理本地会话', async () => {
    const { backend, cookies, service } = createFixture();
    backend.logout.mockRejectedValueOnce(new Error('backend unavailable'));

    await expect(service.logout('refresh-secret')).rejects.toThrow('backend unavailable');

    expect(cookies.clear).toHaveBeenCalledOnce();
  });
});

describe('客户端会话 Store', () => {
  it('只保存公开会话且可清空', () => {
    setActivePinia(createPinia());
    const store = useSessionStore();

    store.setSession({ id: 7, nickname: '玩家' });
    expect(store.session).toEqual({ id: 7, nickname: '玩家' });

    store.clearSession();
    expect(store.session).toBeNull();
  });
});
