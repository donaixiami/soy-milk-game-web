export const SECURITY_HEADERS = {
  'content-security-policy': [
    "default-src 'self'",
    "script-src 'self'",
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
