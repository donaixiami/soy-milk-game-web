import { assertCsrfRequest } from '../../utils/csrf';
import { clearAuthCookies, createEventAuthBff } from '../../utils/auth-event';
import { AUTH_COOKIE_NAMES } from '../../utils/cookies';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const refreshToken = getCookie(event, AUTH_COOKIE_NAMES.refresh);

  assertCsrfRequest({
    expectedOrigin: config.public.siteUrl as string,
    origin: getHeader(event, 'origin'),
    cookieToken: getCookie(event, AUTH_COOKIE_NAMES.csrf),
    headerToken: getHeader(event, 'x-csrf-token'),
  });

  if (!refreshToken) {
    clearAuthCookies(event);
    return { success: true };
  }

  await createEventAuthBff<Record<string, never>, unknown>(event).logout(refreshToken);
  return { success: true };
});
