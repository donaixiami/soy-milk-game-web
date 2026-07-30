<script setup lang="ts">
useSeoPage({
  title: '找回密码',
  description: '找回通用 SSR 站点账号密码。',
  path: '/forgot-password',
  private: true,
});
</script>

<template>
  <main class="mx-auto max-w-md px-6 py-24">
    <h1 class="text-3xl font-700">找回密码</h1>
    <p class="opacity-70">验证码与重置协议将在接入具体后端后由项目配置提供。</p>
  </main>
</template>
