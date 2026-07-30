import type { ThemeColorPreset, ThemeMode } from '../../config/theme';
import { resolveThemePreference } from '../../config/theme';

type ResolvedThemeMode = Exclude<ThemeMode, 'system'>;

export function useTheme() {
  const modeCookie = useCookie<string>('sm_theme_mode', { sameSite: 'lax' });
  const presetCookie = useCookie<string>('sm_theme_preset', { sameSite: 'lax' });
  const preference = resolveThemePreference(modeCookie.value, presetCookie.value);
  const mode = useState<ThemeMode>('theme-mode', () => preference.mode);
  const preset = useState<ThemeColorPreset>('theme-preset', () => preference.preset);
  const systemPrefersDark = useState('theme-system-prefers-dark', () => false);
  const systemListenerRegistered = useState('theme-system-listener-registered', () => false);
  const isHydrated = useState('theme-is-hydrated', () => false);

  const resolvedMode = computed<ResolvedThemeMode>(() => {
    if (mode.value !== 'system') return mode.value;
    return systemPrefersDark.value ? 'dark' : 'light';
  });

  function setMode(value: ThemeMode) {
    mode.value = value;
    modeCookie.value = value;
  }

  function toggleMode() {
    setMode(resolvedMode.value === 'dark' ? 'light' : 'dark');
  }

  function setPreset(value: ThemeColorPreset) {
    preset.value = value;
    presetCookie.value = value;
  }

  if (import.meta.client && !systemListenerRegistered.value) {
    systemListenerRegistered.value = true;
    const nuxtApp = useNuxtApp();

    // 等应用完成水合后再读取系统偏好，避免服务端与客户端首屏节点不一致。
    nuxtApp.hook('app:mounted', () => {
      isHydrated.value = true;
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      systemPrefersDark.value = mediaQuery.matches;
      const updateSystemPreference = (event: MediaQueryListEvent) => {
        systemPrefersDark.value = event.matches;
      };

      mediaQuery.addEventListener('change', updateSystemPreference);
    });
  }

  return {
    mode: readonly(mode),
    preset: readonly(preset),
    isHydrated: readonly(isHydrated),
    resolvedMode,
    setMode,
    setPreset,
    toggleMode,
  };
}
