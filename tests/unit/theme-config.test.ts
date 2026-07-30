import { describe, expect, it } from 'vitest';

import {
  DEFAULT_COLOR_PRESET,
  DEFAULT_THEME_MODE,
  THEME_COLOR_PRESETS,
  resolveThemePreference,
} from '../../layers/core/config/theme';

describe('通用主题配置', () => {
  it('默认跟随系统并使用深海薄荷预设', () => {
    expect(DEFAULT_THEME_MODE).toBe('system');
    expect(DEFAULT_COLOR_PRESET).toBe('deep-mint');
  });

  it('提供三套已确认的颜色预设', () => {
    expect(Object.keys(THEME_COLOR_PRESETS)).toEqual([
      'deep-mint',
      'night-violet',
      'charcoal-amber',
    ]);
  });

  it('拒绝 Cookie 中的非法主题值并返回安全默认值', () => {
    expect(resolveThemePreference('unknown', 'invalid')).toEqual({
      mode: 'system',
      preset: 'deep-mint',
    });
  });
});
