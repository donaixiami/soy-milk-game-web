import { describe, expect, it, vi } from 'vitest';

import { createAuthenticatedRequester } from '../../layers/core/app/utils/authenticated-request';

function unauthorized() {
  return Object.assign(new Error('unauthorized'), { statusCode: 401 });
}

describe('会话感知请求器', () => {
  it('并发 401 共用一次刷新并分别重放原请求', async () => {
    let authorized = false;
    const fetcher = vi.fn(async (path: string) => {
      if (!authorized) throw unauthorized();
      return { path };
    });
    const refresh = vi.fn(async () => {
      authorized = true;
    });
    const requester = createAuthenticatedRequester({
      clearSession: vi.fn(),
      fetcher,
      refresh,
    });

    const result = await Promise.all([requester('/a'), requester('/b')]);

    expect(result).toEqual([{ path: '/a' }, { path: '/b' }]);
    expect(refresh).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledTimes(4);
  });

  it('刷新失败时清理会话且不循环重试', async () => {
    const clearSession = vi.fn();
    const fetcher = vi.fn().mockRejectedValue(unauthorized());
    const refresh = vi.fn().mockRejectedValue(unauthorized());
    const requester = createAuthenticatedRequester({ clearSession, fetcher, refresh });

    await expect(requester('/private')).rejects.toMatchObject({ statusCode: 401 });

    expect(refresh).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledOnce();
    expect(clearSession).toHaveBeenCalledOnce();
  });

  it('显式跳过刷新时直接返回原始 401', async () => {
    const fetcher = vi.fn().mockRejectedValue(unauthorized());
    const refresh = vi.fn();
    const requester = createAuthenticatedRequester({
      clearSession: vi.fn(),
      fetcher,
      refresh,
    });

    await expect(requester('/api/auth/refresh', { skipAuthRefresh: true }))
      .rejects.toMatchObject({ statusCode: 401 });
    expect(refresh).not.toHaveBeenCalled();
  });
});
