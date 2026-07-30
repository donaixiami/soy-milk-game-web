import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  modules: ['@nuxt/image', '@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/eslint'],
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
});
