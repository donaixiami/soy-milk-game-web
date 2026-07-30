<script setup lang="ts">
import { computed } from 'vue';

import { resolveImageSource } from '../../../utils/image-source';

const props = withDefaults(defineProps<{
  src: string | { assetId: string; private: true };
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}>(), { priority: false });

const source = computed(() => resolveImageSource(props.src));
</script>

<template>
  <NuxtImg
    v-if="source.optimized"
    :src="source.src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="priority ? 'eager' : 'lazy'"
  />
  <img
    v-else
    :src="source.src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="priority ? 'eager' : 'lazy'"
  >
</template>
