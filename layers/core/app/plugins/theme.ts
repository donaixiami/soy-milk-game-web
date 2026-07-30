export default defineNuxtPlugin(() => {
  const { preset, resolvedMode } = useTheme();

  useHead(() => ({
    htmlAttrs: {
      'data-theme': resolvedMode.value,
      'data-color-preset': preset.value,
    },
  }));

  if (import.meta.client) {
    // html 根节点由 Head 管理器之外的浏览器环境持有，显式同步可保证运行时切换即时生效。
    watch([resolvedMode, preset], ([nextMode, nextPreset]) => {
      document.documentElement.dataset.theme = nextMode;
      document.documentElement.dataset.colorPreset = nextPreset;
    }, { immediate: true });
  }
});
