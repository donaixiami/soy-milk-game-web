<script setup lang="ts">
useSeoPage({
  title: '通用 SSR 站点',
  description: '面向高 SEO 要求项目的 Nuxt 4 服务端渲染基础框架。',
  path: '/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '通用 SSR 站点',
    url: 'http://localhost:3001/',
  },
});
</script>

<template>
  <main class="mx-auto max-w-5xl px-6 py-24">
    <p class="mb-3 text-sm text-primary font-600">Nuxt 4 · SSR Foundation</p>
    <h1 class="m-0 text-4xl font-700">通用 SSR 站点</h1>
    <p class="mt-5 max-w-2xl text-base leading-7 opacity-75">
      提供服务端渲染、SEO、国际化、主题、请求、图片、上传、动画与图表等通用能力。
    </p>
  </main>
</template>
