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
    public: {
      siteUrl: 'http://localhost:3001',
      siteName: '通用 SSR 站点',
    },
  },
  routeRules: {
    '/': { cache: { maxAge: 60 }, headers: SECURITY_HEADERS },
    '/api/auth/**': { cache: false, headers: { ...SECURITY_HEADERS, 'cache-control': 'no-store' } },
    '/account/**': { cache: false, headers: { ...SECURITY_HEADERS, 'cache-control': 'no-store' } },
    '/preview/**': { cache: false, headers: { ...SECURITY_HEADERS, 'cache-control': 'no-store' } },
    '/**': { headers: SECURITY_HEADERS },
  },
});
