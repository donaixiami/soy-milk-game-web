import { createError } from 'h3';

import { createEventAuthBff } from '../../utils/auth-event';
import { AUTH_COOKIE_NAMES } from '../../utils/cookies';

export default defineEventHandler((event) => {
  const accessToken = getCookie(event, AUTH_COOKIE_NAMES.access);
  if (!accessToken) throw createError({ statusCode: 401, statusMessage: '未登录' });
  return createEventAuthBff<Record<string, never>, unknown>(event).getSession(accessToken);
});
