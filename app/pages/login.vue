<script setup lang="ts">
useSeoPage({
  title: '登录',
  description: '登录通用 SSR 站点。',
  path: '/login',
  private: true,
});
</script>

<template>
  <main class="mx-auto max-w-md px-6 py-24">
    <h1 class="text-3xl font-700">登录</h1>
    <p class="opacity-70">认证表单将在接入具体后端协议后启用。</p>
  </main>
</template>
