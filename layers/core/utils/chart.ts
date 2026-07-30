export function normalizeChartHeight(height: number | string) {
  if (typeof height === 'number') {
    if (height <= 0) throw new Error('图表高度必须大于零');
    return `${height}px`;
  }
  return height;
}
