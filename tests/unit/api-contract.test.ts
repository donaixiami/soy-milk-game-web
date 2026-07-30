import { describe, expect, it } from 'vitest';

import { AppError, fromApiResponse } from '../../layers/core/utils/api-error';
import {
  createBackendRequester,
  sanitizeRequestMeta,
} from '../../layers/core/server/utils/backend-request';

describe('API 错误契约', () => {
  it('将非零业务码转换为业务错误', () => {
    expect(() => fromApiResponse({ code: 1001, data: null, message: '参数错误' }))
      .toThrowError(new AppError('参数错误', 'business', 400, 1001));
  });

  it('返回成功响应中的强类型数据', () => {
    expect(fromApiResponse({ code: 0, data: { id: 1 }, message: 'ok' })).toEqual({ id: 1 });
  });
});

describe('服务端请求器', () => {
  it('GET 网络失败时最多重试一次', async () => {
    let attempts = 0;
    const request = createBackendRequester(async () => {
      attempts += 1;
      if (attempts === 1) throw new TypeError('network');
      return { code: 0, data: 'ok', message: 'ok' };
    });

    await expect(request('/health', { method: 'GET' })).resolves.toBe('ok');
    expect(attempts).toBe(2);
  });

  it('POST 网络失败时不自动重试', async () => {
    let attempts = 0;
    const request = createBackendRequester(async () => {
      attempts += 1;
      throw new TypeError('network');
    });

    await expect(request('/submit', { method: 'POST' })).rejects.toMatchObject({ kind: 'network' });
    expect(attempts).toBe(1);
  });

  it('过滤日志中的认证与敏感字段', () => {
    expect(sanitizeRequestMeta({ authorization: 'Bearer x', cookie: 'a=b', password: '123', requestId: 'r1' }))
      .toEqual({ authorization: '[REDACTED]', cookie: '[REDACTED]', password: '[REDACTED]', requestId: 'r1' });
  });
});
