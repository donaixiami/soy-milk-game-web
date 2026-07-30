export const SECURITY_HEADERS = {
  'content-security-policy': [
    "default-src 'self'",
    // Nuxt SSR 会内联注入 payload/config 引导脚本；禁止它会导致页面仅 SSR 可见但客户端水合失败。
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
} as const;

interface ProductionRuntimeConfig {
  backendBaseUrl: string;
  cookieSecret: string;
  siteUrl: string;
}

export function assertProductionRuntimeConfig(config: ProductionRuntimeConfig) {
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(`缺少生产环境配置: ${missing.join(', ')}`);
  }
}
