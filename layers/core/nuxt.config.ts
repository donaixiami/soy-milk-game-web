import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  // Layer CSS 使用绝对文件 URL，避免 Nuxt 将相对路径当成根应用模块解析。
  css: [fileURLToPath(new URL('./assets/styles/main.css', import.meta.url))],
});
