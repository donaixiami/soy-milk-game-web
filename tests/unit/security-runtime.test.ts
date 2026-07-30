import { describe, expect, it } from 'vitest';

import {
  SECURITY_HEADERS,
  assertProductionRuntimeConfig,
} from '../../layers/core/server/utils/security';
import { createHealthPayload } from '../../layers/core/server/utils/health';

describe('安全响应头', () => {
  it('提供 CSP、HSTS、MIME 与 Referrer Policy', () => {
    expect(SECURITY_HEADERS).toMatchObject({
      'content-security-policy': expect.stringContaining("default-src 'self'"),
      'strict-transport-security': expect.stringContaining('max-age='),
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
    });
    expect(SECURITY_HEADERS['content-security-policy']).not.toContain('unsafe-eval');
  });
});

describe('生产配置校验', () => {
  it('缺少后端地址、Cookie 密钥或站点地址时快速失败', () => {
    expect(() => assertProductionRuntimeConfig({ backendBaseUrl: '', cookieSecret: '', siteUrl: '' }))
      .toThrowError('缺少生产环境配置');
  });
});

describe('健康检查', () => {
  it('返回稳定的进程可用状态', () => {
    expect(createHealthPayload()).toEqual({ status: 'ok' });
  });
});
