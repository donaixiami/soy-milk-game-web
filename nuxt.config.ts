// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['./layers/core'],
  compatibilityDate: '2026-07-30',
  devtools: { enabled: false },
  typescript: { strict: true, typeCheck: true },
})
