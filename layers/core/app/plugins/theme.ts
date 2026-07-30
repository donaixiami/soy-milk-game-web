import { resolveThemePreference } from '../../config/theme';

export default defineNuxtPlugin(() => {
  const modeCookie = useCookie<string>('sm_theme_mode', { sameSite: 'lax' });
  const presetCookie = useCookie<string>('sm_theme_preset', { sameSite: 'lax' });
  const preference = resolveThemePreference(modeCookie.value, presetCookie.value);

  useHead({
    htmlAttrs: {
      'data-theme': preference.mode,
      'data-color-preset': preference.preset,
    },
  });
});
