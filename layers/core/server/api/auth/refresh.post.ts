import { createError } from 'h3';

import { assertCsrfRequest } from '../../utils/csrf';
import { createEventAuthBff } from '../../utils/auth-event';
import { AUTH_COOKIE_NAMES } from '../../utils/cookies';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const refreshToken = getCookie(event, AUTH_COOKIE_NAMES.refresh);
  if (!refreshToken) throw createError({ statusCode: 401, statusMessage: '会话已失效' });

  assertCsrfRequest({
    expectedOrigin: config.public.siteUrl as string,
    origin: getHeader(event, 'origin'),
    cookieToken: getCookie(event, AUTH_COOKIE_NAMES.csrf),
    headerToken: getHeader(event, 'x-csrf-token'),
  });
  return createEventAuthBff<Record<string, never>, unknown>(event).refresh(refreshToken);
});
