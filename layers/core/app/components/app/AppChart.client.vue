<script setup lang="ts">
import type { EChartsCoreOption, EChartsType } from 'echarts/core';
import { init } from 'echarts/core';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { normalizeChartHeight } from '../../../utils/chart';

const props = defineProps<{
  option: EChartsCoreOption;
  height: number | string;
  renderer?: 'canvas' | 'svg';
}>();
const container = ref<HTMLElement>();
const style = computed(() => ({ height: normalizeChartHeight(props.height) }));
let chart: EChartsType | undefined;

onMounted(() => {
  if (!container.value) return;
  chart = init(container.value, undefined, { renderer: props.renderer ?? 'canvas' });
  chart.setOption(props.option);
});
watch(() => props.option, option => chart?.setOption(option, true), { deep: true });
onBeforeUnmount(() => chart?.dispose());
</script>

<template>
  <div ref="container" role="img" :style="style" aria-label="数据图表" />
  <div class="sr-only"><slot name="summary" /></div>
</template>
