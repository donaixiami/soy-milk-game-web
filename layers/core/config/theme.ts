export const THEME_MODES = ['light', 'dark', 'system'] as const;
export const THEME_COLOR_PRESET_NAMES = [
  'deep-mint',
  'night-violet',
  'charcoal-amber',
] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type ThemeColorPreset = (typeof THEME_COLOR_PRESET_NAMES)[number];

export const DEFAULT_THEME_MODE: ThemeMode = 'system';
export const DEFAULT_COLOR_PRESET: ThemeColorPreset = 'deep-mint';

export const THEME_COLOR_PRESETS = {
  'deep-mint': { primary: '#0f9f8f', accent: '#75e6cf' },
  'night-violet': { primary: '#6857e5', accent: '#8da2ff' },
  'charcoal-amber': { primary: '#c78325', accent: '#f3b75f' },
} as const satisfies Record<ThemeColorPreset, { primary: string; accent: string }>;

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return THEME_MODES.includes(value as ThemeMode);
}

function isColorPreset(value: string | null | undefined): value is ThemeColorPreset {
  return THEME_COLOR_PRESET_NAMES.includes(value as ThemeColorPreset);
}

export function resolveThemePreference(
  mode: string | null | undefined,
  preset: string | null | undefined,
) {
  return {
    mode: isThemeMode(mode) ? mode : DEFAULT_THEME_MODE,
    preset: isColorPreset(preset) ? preset : DEFAULT_COLOR_PRESET,
  };
}
