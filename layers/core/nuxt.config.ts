import { fileURLToPath } from 'node:url';

import { SECURITY_HEADERS } from './server/utils/security';

export default defineNuxtConfig({
  modules: ['@nuxt/image', '@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/eslint', '@unocss/nuxt'],
  // Layer CSS 使用绝对文件 URL，避免 Nuxt 将相对路径当成根应用模块解析。
  css: [
    'ant-design-vue/dist/reset.css',
    fileURLToPath(new URL('./assets/styles/main.css', import.meta.url)),
  ],
  i18n: {
    defaultLocale: 'zh-CN',
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'zh-CN',
        language: 'zh-CN',
        file: 'zh-CN.json',
      },
    ],
  },
  runtimeConfig: {
    backendBaseUrl: '',
    cookieSecret: '',
    auth: {
      registerPath: '/api/game-api/auth/register',
      loginPath: '/api/game-api/auth/login',
      logoutPath: '/api/game-api/auth/logout',
      refreshPath: '/api/game-api/auth/refresh',
      sessionPath: '/api/game-api/auth/session',
    },
    public: {
      siteUrl: 'http://localhost:3001',
      siteName: '通用 SSR 站点',
    },
  },
  nitro: {
    // Nitro 会把路径写入虚拟模块，Windows 反斜杠必须标准化以免被当作转义字符。
    errorHandler: fileURLToPath(new URL('./server/error.ts', import.meta.url)).replaceAll('\\', '/'),
  },
  routeRules: {
    '/': { cache: { maxAge: 60 }, headers: SECURITY_HEADERS },
    '/api/auth/**': { cache: false, headers: { ...SECURITY_HEADERS, 'cache-control': 'no-store' } },
    '/account/**': { cache: false, headers: { ...SECURITY_HEADERS, 'cache-control': 'no-store' } },
    '/preview/**': { cache: false, headers: { ...SECURITY_HEADERS, 'cache-control': 'no-store' } },
    '/**': { headers: SECURITY_HEADERS },
  },
});
