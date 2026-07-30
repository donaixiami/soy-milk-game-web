import { describe, expect, it } from 'vitest';

import { getAnimationDuration } from '../../layers/core/utils/motion';
import { normalizeChartHeight } from '../../layers/core/utils/chart';

describe('动画可访问性', () => {
  it('减少动态效果时将动画时长降为零', () => {
    expect(getAnimationDuration(0.45, true)).toBe(0);
    expect(getAnimationDuration(0.45, false)).toBe(0.45);
  });
});

describe('图表稳定布局', () => {
  it('将数字高度转换为 px 并拒绝非正数', () => {
    expect(normalizeChartHeight(320)).toBe('320px');
    expect(() => normalizeChartHeight(0)).toThrowError('图表高度必须大于零');
  });

  it('保留有效 CSS 高度字符串', () => {
    expect(normalizeChartHeight('24rem')).toBe('24rem');
  });
});
