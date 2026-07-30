import { describe, expect, it } from 'vitest';

import { AUTH_COOKIE_OPTIONS, AUTH_COOKIE_NAMES } from '../../layers/core/server/utils/cookies';
import { assertCsrfRequest } from '../../layers/core/server/utils/csrf';
import { createSessionRefreshCoordinator } from '../../layers/core/server/utils/session-refresh';

describe('认证 Cookie', () => {
  it('令牌 Cookie 使用 HttpOnly、Secure 与 SameSite=Lax', () => {
    expect(AUTH_COOKIE_NAMES).toEqual({ access: 'sm_access', refresh: 'sm_refresh', csrf: 'sm_csrf' });
    expect(AUTH_COOKIE_OPTIONS.token).toMatchObject({ httpOnly: true, secure: true, sameSite: 'lax' });
    expect(AUTH_COOKIE_OPTIONS.csrf).toMatchObject({ httpOnly: false, secure: true, sameSite: 'lax' });
  });
});

describe('CSRF 校验', () => {
  it('拒绝来源不匹配的写请求', () => {
    expect(() => assertCsrfRequest({ expectedOrigin: 'https://site.test', origin: 'https://evil.test', cookieToken: 'a', headerToken: 'a' }))
      .toThrowError('请求来源不受信任');
  });

  it('拒绝 Cookie 与请求头令牌不一致的写请求', () => {
    expect(() => assertCsrfRequest({ expectedOrigin: 'https://site.test', origin: 'https://site.test', cookieToken: 'a', headerToken: 'b' }))
      .toThrowError('CSRF 校验失败');
  });
});

describe('会话刷新协调器', () => {
  it('同一会话的并发刷新共用一个 Promise', async () => {
    let calls = 0;
    const coordinator = createSessionRefreshCoordinator();
    const refresh = () => {
      calls += 1;
      return Promise.resolve('new-token');
    };

    const result = await Promise.all([
      coordinator.run('session-1', refresh),
      coordinator.run('session-1', refresh),
    ]);

    expect(result).toEqual(['new-token', 'new-token']);
    expect(calls).toBe(1);
  });

  it('不同会话不会共享刷新锁', async () => {
    let calls = 0;
    const coordinator = createSessionRefreshCoordinator();
    const refresh = () => Promise.resolve(++calls);

    await Promise.all([
      coordinator.run('session-1', refresh),
      coordinator.run('session-2', refresh),
    ]);

    expect(calls).toBe(2);
  });
});
